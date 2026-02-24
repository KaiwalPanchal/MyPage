---
title: "Scaling Data Ingestion: How I Pruned 84% of Redundant Web Data Before It Hit Our Vector Database"
date: "2026-01-12"
description: "During my internship at a consulting tech firm, I discovered that a single RBI circular existed as 67 separate vectors. Here's how I built a MinHash + LSH deduplication pipeline that reduced 7.8M vectors to 1.2M — and made our RAG system actually useful."
image: "/MyPage/blog/dedup-hero.png"
author:
  name: "Kaiwal"
  image: "/MyPage/images/kaiwal.jpg"
category: "Data Engineering"
---

A client called in, frustrated. They'd asked our RAG-powered intelligence chatbot a straightforward question about the latest RBI circular on digital lending guidelines. The chatbot dutifully returned four results — all saying the same thing, each worded slightly differently.

I pulled up the vector database to investigate. What I found made my stomach drop.

**That single RBI circular existed as 67 separate embeddings** — scraped from RBI.org, then the Ministry of Finance portal, then three PSU bank internal portals, then Economic Times, Mint, Business Standard, and on and on.

We weren't building intelligence. We were building an echo chamber — and our vector database was 6× larger than it needed to be.

---

## The Setting

I was interning at a consulting tech firm — they sell policy and market intelligence to PSUs, BFSI clients, and MNC India offices. Their promise to clients: *"We track everything — before your competitors do."*

They were scraping **2,200 sources** nightly, ingesting roughly **85,000 documents per day** into a RAG pipeline. The sources fell into two broad categories, and both had a massive redundancy problem.

### Government Sources (The Main Offenders)

The Indian government information ecosystem is structurally redundant:

- **PIB (Press Information Bureau)** publishes press releases that then get mirrored *verbatim* across every individual ministry website
- Ministry of Finance, MoCI, DPIIT, MeitY — all republish the same PIB release with their own header
- **28 state government portals** each maintain their own copy of central government circulars
- RBI, SEBI, IRDAI, TRAI — each has its own portal but cross-references heavily
- PRS Legislative Research, Lok Sabha/Rajya Sabha Q&A archives
- GeM and tender portals like CPPP — massive duplication across state procurement sites

**One PIB press release = ~50 copies across government portals.**

### News Sources

The news landscape is even worse:

- **PTI and ANI** are the root source for roughly **60% of Indian news** — but their stories get published across 500+ outlets
- The Hindu, Hindustan Times, TOI, Economic Times, Business Standard, Mint — all wire the same PTI/ANI story with minor edits
- Regional language outlets translating the same story add yet another layer

**One wire story = hundreds of near-identical publications.**

This isn't a bug in the scraper — it's a feature of how Indian information flows.

```
  ┌─────────────────────────────────────────────┐
  │              PIB Press Release               │
  └──────────────────┬──────────────────────────┘
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
  ┌────────┐   ┌──────────┐   ┌──────────────┐
  │ MoF    │   │ MeitY    │   │ DPIIT        │
  │ Portal │   │ Portal   │   │ Portal       │
  └────────┘   └──────────┘   └──────────────┘
      │              │              │
      ▼              ▼              ▼
  ┌────────┐   ┌──────────┐   ┌──────────────┐
  │ 28     │   │ Economic │   │ Hindustan    │
  │ State  │   │ Times    │   │ Times        │
  │ Portals│   │          │   │              │
  └────────┘   └──────────┘   └──────────────┘

  Same content, 50+ different URLs, slightly
  different formatting. Exact hashing fails.
```

---

## The Numbers That Hurt

After three months of this pipeline running unfiltered, here's what we were sitting on:

<table>
  <thead>
    <tr>
      <th>Metric</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Sources monitored</td>
      <td>2,200</td>
    </tr>
    <tr>
      <td>Documents ingested per night</td>
      <td>~85,000</td>
    </tr>
    <tr>
      <td>Vectors in DB (3 months)</td>
      <td><strong>7.8 million</strong></td>
    </tr>
    <tr>
      <td>Estimated redundancy rate</td>
      <td><strong>~84%</strong></td>
    </tr>
    <tr>
      <td>RAG retrieval quality (analyst rating)</td>
      <td><strong>3.1 / 5</strong></td>
    </tr>
  </tbody>
</table>

The quality rating was the real kicker. When 67 near-duplicates of the same document exist in your vector store, cosine similarity retrieval pulls multiple copies into the context window. The LLM gets confused, produces echo answers, and the analysts lose trust in the system.

This was simultaneously a **resource waste problem** and a **quality problem**. Embedding API calls were burning through millions of tokens per month on content that was saying the same thing. The vector database storage was ballooning — 31+ GB of vectors, most of which were redundant.

---

## Why Naive Fixes Failed

Before I built the dedup pipeline that actually worked, I tried (and watched fail) three simpler approaches.

### Attempt 1: URL Deduplication

The simplest idea: if we've seen this URL before, skip it.

**Why it failed:** PIB content lives on 40+ different domains. The same press release about the Union Budget exists at `pib.gov.in/...`, `finmin.nic.in/...`, `dpiit.gov.in/...`, and a dozen state government portals — each with a completely different URL. URL dedup catches nothing here.

### Attempt 2: Exact Hash Deduplication (MD5)

Compute an MD5 hash of each document's text. If the hash matches something already in the database, skip it.

**What worked:** This caught roughly 20% of duplicates — the truly verbatim copies.

**What broke:** Everything else.

- **PTI wire stories**: Each outlet adds a dateline ("New Delhi, Feb 24"), a byline, publication timestamp, and minor editorial tweaks. This is enough to change the MD5 hash but not enough to change the meaning.
- **Government PDFs (OCR noise)**: Ministry PDFs are often scanned documents, not born-digital. The same 10-page policy document scraped from 5 state portals produces 5 *slightly different* text versions because of OCR quality differences. `"fiscal"` becomes `"f1scal"`, `"policy"` becomes `"poIicy"` (capital I vs lowercase l).
- **Site boilerplate**: Government sites inject navigation text, headers, footers, and disclaimers that differ per portal.

We eliminated the easy 20% and were left with the hard 80% — documents that are **semantically identical but textually different.**

### Attempt 3: Embedding Similarity (Post-Hoc)

"Just embed everything, then do a similarity search to find and remove duplicates after the fact."

**Why it failed on two fronts:**

1. **You've already paid for the embeddings.** The whole point is to avoid computing embeddings on redundant content.
2. **All-pairs similarity search across 7.8M vectors is O(n²).** That's ~30 trillion comparisons. Computationally insane.

This is dedup at the wrong end of the pipeline.

I needed something that worked **at ingestion time**, was **fuzzy enough** to catch OCR noise and minor edits, but **fast enough** to run on 85,000 documents per night.

---

## The Architecture I Built

Here's the pipeline I designed and implemented:

```
  ┌──────────┐     ┌──────────────┐     ┌──────────────┐
  │  Scrapy  │────▶│    Text      │────▶│ Bloom Filter │
  │  Crawl   │     │  Extraction  │     │   (Redis)    │
  │ 2,200    │     │  & Normalize │     │              │
  │ sources  │     │              │     │  Exact hash  │
  └──────────┘     └──────────────┘     │  check: O(1) │
                                        └──────┬───────┘
                                               │
                                    ┌──────────┴──────────┐
                                    │  Seen before?       │
                                    │                     │
                                ┌───┴───┐            ┌────┴────┐
                                │  YES  │            │   NO    │
                                │ (20%) │            │  (80%)  │
                                └───┬───┘            └────┬────┘
                                    │                     │
                                    ▼                     ▼
                              ┌──────────┐        ┌──────────────┐
                              │   Skip   │        │  MinHash LSH │
                              │ (verbatim│        │  (datasketch)│
                              │  dupe)   │        │              │
                              └──────────┘        │ Fuzzy match: │
                                                  │ Jaccard 0.6  │
                                                  └──────┬───────┘
                                                         │
                                              ┌──────────┴──────────┐
                                              │  Near-duplicate?    │
                                              │                     │
                                          ┌───┴───┐            ┌────┴────┐
                                          │  YES  │            │   NO    │
                                          │ (64%) │            │  (16%)  │
                                          └───┬───┘            └────┬────┘
                                              │                     │
                                              ▼                     ▼
                                        ┌──────────┐        ┌──────────────┐
                                        │  Link to │        │   Embed &    │
                                        │ Canonical│        │   Store in   │
                                        │ Document │        │   Qdrant     │
                                        └──────────┘        └──────────────┘
                                              │                     │
                                              ▼                     ▼
                                        ┌────────────────────────────────┐
                                        │   Metadata Log (PostgreSQL)   │
                                        │   source, timestamp,          │
                                        │   canonical_id, dedup_reason  │
                                        └────────────────────────────────┘
```

Let me walk through each stage.

**1. Scrapy Crawl** — 2,200 sources, nightly. Standard `Scrapy` spiders with politeness settings and retry logic. Nothing fancy here.

**2. Text Extraction & Normalization** — Strip headers, footers, navigation boilerplate. Normalize whitespace. For PDFs: Tesseract OCR → text cleaning pipeline that handles common OCR artifacts.

**3. Bloom Filter (Redis)** — The first-pass cheap check. Compute a content hash (SHA-256 of normalized text) and check it against a Redis bloom filter. This catches the ~20% that are verbatim copies — *before we even compute MinHash*. O(1) lookup, trivial memory footprint.

**4. MinHash LSH (datasketch)** — The core engine. For every document that passes the bloom filter, compute a MinHash signature from its text shingles. Query the LSH index for near-duplicates above a Jaccard similarity threshold of 0.6. If a match is found, mark as duplicate and link to the canonical document.

**5. Dedup Decision Logic** — Not all duplicates are simply discarded. If a "duplicate" comes from a higher-authority source (e.g., RBI.org vs. Mint reprinting the same circular), we swap the canonical to point to the authoritative source. Every document retains source metadata for provenance.

**6. Embed & Store** — Only canonical documents get embedded and stored in Qdrant. This is where the massive resource savings happen — we're embedding ~16% of the ingested content instead of 100%.

**7. Metadata Logging (PostgreSQL)** — Every document, including duplicates, gets a metadata row: source URL, scrape timestamp, `canonical_id`, and `dedup_reason`. Full audit trail. If a client asks "did you see the Business Standard article about X?" — we can confirm we ingested it and link them to the canonical version.

**Orchestration:** The whole thing runs as an Airflow DAG with clear stage dependencies, retry logic on transient failures, and Slack alerts when anomaly rates spike (e.g., if a source suddenly produces 0 documents, something's wrong with the scraper).

---

## Deep Dive: How MinHash + LSH Actually Works

This is the technical core of the pipeline. I'll explain it clearly enough that you can implement it, concisely enough that you won't skip it.

### The Shingling Step

First, we break each document into overlapping **n-grams** (also called shingles). For a 5-gram shingle:

```
Input:  "the rbi has issued new guidelines for digital lending"
5-grams: ["the r", "he rb", "e rbi", " rbi ", "rbi h", "bi ha", ...]
```

Each document becomes a **set of shingles**. Two documents that say the same thing in slightly different words will share most of their shingles. OCR noise (`"fiscal"` → `"f1scal"`) affects only the shingles containing that word — the other 95% of shingles still match.

### The MinHash Signature

Comparing raw shingle sets is expensive (they can contain tens of thousands of elements). MinHash compresses each shingle set into a fixed-size **signature** — typically 128 or 256 hash values.

The key mathematical property: **the probability that two MinHash signatures agree at any position equals the Jaccard similarity of the original sets.** This means we can estimate how similar two documents are just by comparing their (tiny) signatures instead of their (massive) shingle sets.

### Locality Sensitive Hashing (LSH)

Even with compact signatures, comparing every new document against all existing signatures is O(n) — too slow at scale.

LSH solves this by splitting signatures into **bands** and hashing each band into buckets. Two documents that share at least one bucket become **candidates** for full comparison. Documents that aren't similar are unlikely to share any bucket.

This turns a linear scan into a near-constant-time lookup for most documents.

### The Code

Here's the core implementation using Python's `datasketch` library:

```python
from datasketch import MinHash, MinHashLSH

# Initialize LSH index with Jaccard threshold 0.6
lsh = MinHashLSH(threshold=0.6, num_perm=128)

def get_minhash(text, num_perm=128):
    """Compute MinHash signature from text shingles."""
    m = MinHash(num_perm=num_perm)
    # Generate 5-character shingles
    tokens = text.lower().split()
    for i in range(len(tokens) - 4):
        shingle = ' '.join(tokens[i:i+5])
        m.update(shingle.encode('utf-8'))
    return m

def check_and_insert(doc_id, text):
    """Check for near-duplicates, insert if unique."""
    doc_hash = get_minhash(text)

    # Query LSH index for candidates
    candidates = lsh.query(doc_hash)

    if candidates:
        # Near-duplicate found
        canonical_id = candidates[0]
        mark_as_duplicate(doc_id, canonical_id)
        log_metadata(doc_id, canonical_id, reason="minhash_match")
        return False  # Not unique

    # New unique document — add to index and embed
    lsh.insert(doc_id, doc_hash)
    embed_and_store(doc_id, text)
    return True  # Unique
```

### Threshold Tuning

I tested thresholds from 0.4 to 0.8 against a hand-labeled sample of 500 document pairs:

<table>
  <thead>
    <tr>
      <th>Threshold</th>
      <th>True Duplicates Caught</th>
      <th>False Positives</th>
      <th>Verdict</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0.4</td>
      <td>98%</td>
      <td>12%</td>
      <td>Too aggressive — merging different articles on the same topic</td>
    </tr>
    <tr>
      <td>0.5</td>
      <td>96%</td>
      <td>5%</td>
      <td>Better, but still some false merges</td>
    </tr>
    <tr>
      <td><strong>0.6</strong></td>
      <td><strong>93%</strong></td>
      <td><strong>1.2%</strong></td>
      <td><strong>Sweet spot</strong></td>
    </tr>
    <tr>
      <td>0.7</td>
      <td>84%</td>
      <td>0.3%</td>
      <td>Missing too many PTI wire variants</td>
    </tr>
    <tr>
      <td>0.8</td>
      <td>61%</td>
      <td>0.1%</td>
      <td>Only catching near-verbatim copies — basically MD5 with extra steps</td>
    </tr>
  </tbody>
</table>

**0.6 was the sweet spot** — aggressive enough to catch PTI wire story variants (which typically show Jaccard similarity of 0.75–0.85), conservative enough to keep genuinely different articles that happen to discuss the same topic.

---

## The India-Specific Wrinkles

These are the problems that make this blog post different from a generic "we deduplicated some data" story. These are real, verifiable structural issues in the Indian data ecosystem.

### 1. The PIB Mirror Problem

One PIB press release about, say, the Union Budget gets published on `pib.gov.in`. Within hours, it appears word-for-word on the Ministry of Finance portal — but with their header and navigation. Then DPIIT copies it. Then 28 state government portals include it in their daily roundup. Each copy has different CSS-to-text artifacts, different boilerplate, different URL structures.

**Before the pipeline:** One PIB release = ~50 vectors in the database.
**After:** One PIB release = exactly 1 vector, canonical source set to `pib.gov.in`, with provenance links to all 50 mirrors.

### 2. The PTI/ANI Wire Problem

60% of Indian news originates from two wire services. But each outlet that publishes a PTI story adds their own:

- Dateline ("New Delhi, Feb 24")
- Byline ("By Staff Reporter")
- Publication timestamp
- Minor editorial tweaks (changing "said" to "stated", reordering paragraphs)

This is enough to produce a completely different MD5 hash. But it's not enough to be genuinely different *information*. MinHash with 5-gram shingles catches these reliably — they typically show Jaccard similarity of 0.75–0.85, well above our 0.6 threshold.

### 3. The Government PDF / OCR Problem

This is the wrinkle that makes MinHash specifically the right tool over simpler approaches.

Ministry PDFs from sites like `rbi.org.in` or state finance department portals are frequently **scanned documents**, not born-digital PDFs. When you OCR the same 10-page policy document scraped from 5 different state portals, you get 5 *slightly different* text versions:

- `"fiscal"` → `"f1scal"` (OCR confuses `i` with `1`)
- `"policy"` → `"poIicy"` (capital I vs. lowercase l)
- `"₹2,500"` → `"72,500"` (₹ symbol misread as `7`)

Exact hashing fails completely here. But MinHash works on **shingle overlap** — if 90% of the 5-grams are identical despite a few character-level OCR errors, the Jaccard similarity is still ~0.88. Well above threshold.

---

## Results

After deploying the pipeline and running it for a month:

<table>
  <thead>
    <tr>
      <th>Metric</th>
      <th>Before</th>
      <th>After</th>
      <th>Change</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Vectors in DB (3 months)</td>
      <td>7.8M</td>
      <td>1.2M</td>
      <td><strong>-84.6%</strong></td>
    </tr>
    <tr>
      <td>Embedding API calls/month</td>
      <td>~2.5M</td>
      <td>~400K</td>
      <td><strong>-84%</strong></td>
    </tr>
    <tr>
      <td>Vector DB storage</td>
      <td>~31 GB</td>
      <td>~5 GB</td>
      <td><strong>-83.9%</strong></td>
    </tr>
    <tr>
      <td>RAG retrieval quality</td>
      <td>3.1/5</td>
      <td>4.4/5</td>
      <td><strong>+41.9%</strong></td>
    </tr>
    <tr>
      <td>Ingestion pipeline time/night</td>
      <td>~4.5 hrs</td>
      <td>~5.2 hrs</td>
      <td>+15.6%</td>
    </tr>
  </tbody>
</table>

The pipeline time *increased* slightly because of the MinHash computation overhead. That was an acceptable trade-off — 45 extra minutes per nightly run in exchange for an 84% reduction in downstream resource consumption.

The qualitative improvement was even more dramatic. Analysts stopped getting "echo answers." The RBI circular problem — the one that started this whole project — completely disappeared. When a client asked about a specific notification, they got exactly one clean, authoritative answer sourced from the original issuing body.

The vector database went from requiring a scaled cluster to running comfortably on a single modest instance. Embedding API token consumption dropped by roughly 5×.

---

## Lessons Learned

Three things I'd tell anyone building a RAG pipeline on Indian data:

**1. Deduplicate before you embed, not after.** The cheapest embedding is the one you never compute. The cheapest vector is the one you never store. Push deduplication as far upstream as possible.

**2. Fuzzy dedup is non-negotiable in India.** The PIB mirror problem, the PTI wire problem, and the government OCR problem form a trifecta that makes exact hashing nearly useless. It catches less than 20% of actual redundancy.

**3. Source authority matters.** Don't just delete duplicates blindly. Keep the one from the most authoritative source (RBI.org over a Mint article about an RBI circular) and maintain full provenance. Your analysts need to trust the source, not just the content.

---

## What's Next

This pipeline solved the immediate problem, but there's more to explore:

- **Cross-lingual deduplication** — the same government announcement in Hindi, English, and regional languages is semantically identical but textually unrelated. MinHash won't catch this. Embedding-based approaches (applied *after* MinHash prunes the obvious duplicates) could handle this as a second stage.
- **Incremental MinHash** — when a government circular gets *revised* (not duplicated), we want to update the canonical document, not treat the revision as a duplicate. Detecting updates vs. duplicates is a nuanced problem.
- **Real-time dedup** — moving from nightly batch processing to a streaming pipeline that deduplicates at crawl time. Redis Streams + MinHash could make this feasible.

If you're building RAG in India, you're building on a firehose of beautifully redundant data. The question isn't whether you need a dedup layer — it's how many GPU hours and API calls you'll burn before you build one.
