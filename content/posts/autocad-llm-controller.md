---
title: "Teaching a Language Model to Read Maps It Was Never Meant to See"
date: "2025-03-14"
description: "How I built a system that bridges PyAutoCAD and an LLM to extract structured spatial data from town planning drawings — and all the ways it almost didn't work."
image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000"
author:
  name: "Kaiwal"
  image: "/MyPage/images/kaiwal.jpg"
category: "Engineering"
---

There's a particular kind of drawing that exists in a strange limbo between engineering artifact and legal document. It's called a **Town Planning (TP) Scheme** — or depending on the region, a layout plan, a DP (Development Plan), or a cadastral map. It shows plots of land, DP roads, margins, setbacks, and zone classifications. It has been signed by an empanelled architect or town planner. It has a Survey Number, Gat Number, or Plot Number that appears in official 7/12 extracts and property registrations.

The problem I needed to solve was this: I had a pipeline that processed land parcels for map analysis. That pipeline expected machine-readable structured data. But the source of truth — the document that actually defined the plots — was a `.dwg` file sitting on a Windows machine, drawn by a draftsperson fifteen years ago, with layer names that made sense to exactly one person.

This is the story of how I built a system to read those drawings.

---

## The File Nobody Wanted to Parse

AutoCAD's `.dwg` format is proprietary and decades old. There are open-source parsers — `ezdxf` being the most capable Python option — but they speak DXF (the open exchange format), not DWG natively. More importantly, when you're dealing with AutoCAD LT specifically (the cheaper, more restricted version that most small councils and survey firms actually run), your options collapse significantly.

Here's what AutoCAD LT doesn't give you: a LISP runtime. A .NET API. Any headless mode. COM automation support that's complete.

Here's what it *does* give you: a live COM interface to a running instance. And that's it.

So the first architectural decision was already made for me. There was no reading the file in the background, no batch processing in a Docker container, no clever library that would open the DWG in memory and hand me a neat object graph. If I wanted to read this drawing, I needed AutoCAD LT to be open on a Windows machine, the drawing loaded, and a Python process connected to it over COM.

```
.dwg file
    │
    ▼
┌───────────────────┐
│   AutoCAD LT      │  ← Must be running. Must have drawing open.
│   (GUI open)      │     No headless mode. Windows only.
└────────┬──────────┘
         │  win32com / pyautocad
         ▼
┌───────────────────┐
│  Python Process   │
│  (COM client)     │
└───────────────────┘
```

This constraint defined everything downstream.

---

## What's Actually In a Town Plan Drawing

Before writing a single line of extraction code, I spent time just opening drawings and asking: what am I actually working with here?

A typical town plan drawing, viewed in AutoCAD, looks nothing like what you might expect from a GIS layer or a clean cadastral dataset. Take the Vastral–Ramol TPS (Town Planning Scheme) as a representative example: it's a dense, color-coded plan with dozens of zone types rendered in distinct fill colors — yellow for "Sale for Residence," pink for "Socially and Economically Weaker" housing, cyan for "Tank/Waterbody," green-grey for "Open Space/Garden/Play Ground," blue for "Commercial Use," and so on — all annotated with plot numbers, road widths (18.00M, 24.00M), survey markers, school sites, ONGC reservations, and a legend in the corner that is the only thing telling you what any of the colors actually mean.

The legend, it turns out, was one of the most practically useful artifacts in the entire drawing. Not because it was machine-readable — it wasn't — but because it gave me the semantic key I needed to make sense of the geometry.

Under the hood, that drawing is a collection of entities. Not a clean, structured collection — just a flat list, in the order they were drawn. Each entity has a type, a layer, some geometry, and maybe some attributes. There's no inherent hierarchy. There's no field that says "this polyline is a parcel boundary." The semantics are implicit, encoded in the layer name, the fill color, the nearby text, and the conventions of the specific draftsperson.

The entity types you care about in a town plan:

- **LWPOLYLINE / POLYLINE** — closed polygons for plots, zones, DP roads
- **LINE** — individual wall segments, plot boundaries, road margins
- **ARC and CIRCLE** — roundabouts, curved plot boundaries
- **TEXT and MTEXT** — plot/survey numbers, area annotations, zone labels (e.g., R1/R2), street names
- **INSERT** — block references for symbols: north arrows, title blocks, utility markers
- **HATCH** — zone fill patterns (`ANSI31` on `R1_ZONE`, `SOLID` on `ROAD`)
- **DIMENSION** — road widths, setback margins (front/side/rear)

The good news: `pyautocad`, which wraps the COM interface, lets you iterate over all of this. The bad news: that flat list can have thousands of entities in a complex plan, and COM calls are slow. Every property access is a round-trip over the COM interface.

---

## Layer 1: Getting Data Out of AutoCAD

### The Connection Problem

COM connections to AutoCAD LT are fragile. If the drawing changes, if AutoCAD displays a dialog box, if the user switches drawings — the connection can silently drop. My first mistake was treating the connection like a file handle. Open it once, use it everywhere.

The fix was to treat the COM connection as a managed resource with health checks. Before every batch of COM operations, the layer checks that the connection is still valid by attempting a light property access (like getting the active document name). If it fails, it reconnects. This sounds obvious but the failure mode is subtle: a dropped COM connection doesn't immediately throw an exception in many cases. It silently returns garbage or zero values. You don't notice until your polygon has an area of `0.0` and you spend an hour wondering why the geometry layer is returning nonsense.

### Entity Traversal and Allow-listing

Iterating the model space is straightforward — the COM interface gives you an iterable of entities. The problem is that the model space contains *everything*, including entity types that the COM interface doesn't fully support in LT: OLE objects, custom third-party types, external references. Touching these raises COM errors that can crash the traversal loop.

The solution is an explicit allow-list. Before processing any entity, its internal object name is checked against a hardcoded set of supported types (like `AcDbPolyline`, `AcDbText`, `AcDbHatch`). If the entity type isn't in the list, I log it and skip it. Defensive by default.

### Layers as a Semantic Index

The most important data point in the entire drawing — before any geometry is processed — is the layer list. Layers in a well-maintained town plan drawing in India are named things like `BOUNDARY`, `PLOT_LINE`, `DP_ROAD`, `MARGIN_SETBACK`, `CONTOUR_5M`, `ZONE_R1`, `ZONE_COMMERCIAL`.

Before touching a single entity, I pull all layer names and build a classification map:

```
Layer Name                 Inferred Class
─────────────────────────────────────────
BOUNDARY                → plot_boundary
DP_ROAD                 → road
PLOT                    → parcel
SETBACK                 → margin
TEXT_PLOTNUM            → plot_label
TITLE_BLOCK             → metadata
HATCH_R1                → residential_zone
CONTOUR_1M              → topography
```

This classification map is a first-pass semantic index built before the LLM is involved at all. It means that when I hand a chunk of entities to the LLM later, each one already has a probable semantic class attached. The LLM is confirming or correcting, not starting from scratch.

---

## Layer 2: Making Geometry Meaningful

### The Coordinate Problem

Raw CAD coordinates are in drawing units. Those units might be millimeters at 1:500 scale, or they might be meters in a real-world coordinate system. The title block usually tells you — if you can read it. For now, I'll just say: coordinate normalization is a necessary step, and the approach depends on whether the drawing has a known survey datum embedded in its attributes.

For drawings without a CRS (which is depressingly common), I normalize to a local coordinate system centered on the drawing's bounding box, then flag the output as "requires georeferencing" for downstream steps.

### Polylines and the Area You Already Have (Sometimes)

Here's a piece of luck — when it applies: closed LWPOLYLINE entities in AutoCAD have an area property accessible directly over COM. If you verify the entity is a closed polyline, you can read the correct area immediately. No shoelace formula required.

The problem is that in actual TPS drawings, many boundaries aren't closed polylines at all. They're individual LINE segments drawn edge by edge. For these, there's no area property to read — the polygon doesn't exist as a discrete entity in the drawing. The area has to be computed from the reconstructed closed loops, using the shoelace formula on the vertex list assembled during the clustering step. So the fast path exists and is used when available, but it can't be assumed.

### Topology: Which Parcel Is Next to Which Road

Individual entities don't tell you much. What tells you something is the relationship between entities. Plot 22 shares a boundary with the proposed DP road. Plot 22 is adjacent to Plot 23. Plot 22 is inside an R1 Residential Zone.

Building this topology locally — in Python, before anything goes to the LLM — is one of the most important decisions in the architecture. A naive approach would hand the LLM a list of polygons and ask it to figure out adjacency. That works for three polygons. It falls apart at three hundred.

The topology layer computes:
1. **Shared edges** — polylines that share vertex sequences (within a snap tolerance) are flagged as adjacent
2. **Point-in-polygon containment** — which polygon contains which other polygon's centroid (plots inside zone)
3. **Text-to-polygon association** — spatial join: for each text entity, find the polygon that contains its insertion point

The last one deserves a closer look. A TEXT entity reading `"Plot 22 — 650 sq.m"` is somewhere near the polygon it labels, but not necessarily inside it. The heuristic: check if the text insertion point is inside any closed polygon. If yes, that's the label. If no, find the nearest polygon centroid within a threshold distance. This works reliably except for annotations that belong to very thin plot shapes, where the centroid is near the boundary.

```
TEXT: "Plot 22 — 650 sq.m"
  insertion point: (142.3, 88.5)
              │
              ▼
  ┌─── Is (142.3, 88.5) inside any closed polyline? ───┐
  │                                                     │
  Yes → associate TEXT with that polyline              No → find nearest centroid
```

### The Intermediate Representation

The output of this geometry layer is a list of *spatial features*, each represented as a JSON object:

```json
{
  "id": "feature_042",
  "entity_type": "LWPOLYLINE",
  "layer": "PLOT",
  "inferred_class": "parcel",
  "centroid": [142.3, 88.5],
  "bounding_box": [128.0, 74.0, 163.0, 108.0],
  "area_sqm": 650.0,
  "vertex_count": 6,
  "labels": ["Plot 22", "650 sq.m"],
  "adjacent_ids": ["feature_037", "feature_041", "feature_dp_road_01"],
  "contained_by": ["feature_zone_r1_01"]
}
```

This is what the LLM sees. Not raw coordinates. Not entity handles. A structured representation that captures what the geometry *means*, as much as can be determined computationally.

---

## Layer 3: What the LLM Actually Does

This is the part that surprised me, both in how well it worked and where it broke.

### The Fundamental Problem with Rules

The naive approach to interpreting a town plan is to write rules. `ZONE_R1` → residential. `DP_ROAD` → road. Area annotation matching `\d+ sq.m` → area in square meters.

This works until it doesn't. And it stops working constantly, because there is no standard. Different municipal corporations (like BMC, PMC, or BBMP) and development authorities use different layer naming conventions. Different architectural firms have different abbreviation styles. A layer named `R1` might mean residential zone in one drawing and a road identifier in another. A TEXT entity reading `S.No. 45/1/A` or `Gat No. 12` follows specific Indian land record formats that you'd need domain knowledge to parse correctly.

I kept adding edge cases to the rule-based system. It grew. It became brittle. I was maintaining a thesaurus of Indian surveying and planning abbreviations (`FSI`, `FAR`, `CTS No.`, `TPS`) in a Python dictionary and I knew it was going wrong.

The LLM handles this naturally. It knows that `R1`, `RES_ZONE`, and `Residential Use` on a hatch layer in a planning context are all pointing at the same concept. It understands regional plot notation formats. It can read a list of features and infer the drawing type from context.

### Prompt Architecture

Rather than one giant prompt asking the LLM to "interpret this drawing," I decomposed the task into a pipeline of focused passes:

```
┌─────────────────────────────────────────────────────────┐
│                    PROMPT PIPELINE                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Pass 1: Classification                                  │
│  Input:  layer list + entity sample                     │
│  Output: drawing type, naming conventions in use        │
│                                                          │
│        ↓                                                 │
│                                                          │
│  Pass 2: Feature Identification                         │
│  Input:  feature chunks (spatially grouped)             │
│  Output: semantic labels for each feature               │
│                                                          │
│        ↓                                                 │
│                                                          │
│  Pass 3: Area Extraction                                │
│  Input:  identified parcel features + computed areas    │
│  Output: confirmed/corrected area per parcel            │
│                                                          │
│        ↓                                                 │
│                                                          │
│  Pass 4: Relationship Extraction                        │
│  Input:  labeled features + adjacency graph             │
│  Output: frontage, access points, containment           │
│                                                          │
│        ↓                                                 │
│                                                          │
│  Pass 5: Anomaly Detection                              │
│  Input:  full extraction + computed geometry            │
│  Output: flags for unlabeled parcels, area mismatches   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

Each pass is a separate API call with a focused system prompt. The system prompt for Pass 1 establishes the LLM as a spatial data analyst who understands town planning conventions. It tells the model what input format to expect (the JSON feature representation), what output format to produce (structured JSON), and gives examples of abbreviation patterns.

Pass 5 — anomaly detection — was an addition I hadn't planned. But once I could compare the LLM's extracted area annotations against the computationally measured polygon areas, the discrepancies were immediately useful. A 10% discrepancy might mean the annotation is stale (the lot was subdivided and redrawn but the label wasn't updated). It might mean the polyline isn't quite closed and the area computation is off. Either way, it's worth flagging before the data is used for anything with legal weight.

### The Chunking Problem

Large drawings have thousands of entities. They don't fit in a context window. Naive chunking by token count is wrong — it splits related entities across chunks, so the LLM processing chunk 3 doesn't know that the TEXT entity in chunk 2 is the label for the polyline it's currently looking at.

The solution is spatially coherent chunking. Features are grouped by proximity using their bounding box data. A lot polygon, its text labels, its adjacent hatches, and its shared boundary segments will all end up in the same chunk because they're spatially close. The LLM can reason about their relationships within a single context.

```
Drawing Bounding Box
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌────────────┐    ┌────────────┐                  │
│  │  Chunk A   │    │  Chunk B   │                  │
│  │ Plots 1-8  │    │ Plots 9-15 │                  │
│  │ DP Road N  │    │ DP Road E  │                  │
│  └────────────┘    └────────────┘                  │
│                                                     │
│  ┌────────────┐    ┌────────────┐                  │
│  │  Chunk C   │    │  Chunk D   │                  │
│  │ Plots 16-21│    │ Plots 22-28│                  │
│  │ Setback    │    │ Zone Bdy   │                  │
│  └────────────┘    └────────────┘                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

The LLM processes each chunk and produces partial extractions. These are merged in post-processing. Merge conflicts (the same entity appearing in two overlapping chunks with different interpretations) are resolved by confidence score — the extraction with more contextual support wins.

### Structured Output Before Tool-Use Existed

Here's a timestamp for this project: it was built before LLM providers had widespread support for function calling or structured JSON outputs. Which meant that getting the LLM to reliably return valid JSON required persuasion.

The system prompt includes something like:

> You must respond with valid JSON only. No preamble. No explanation. No markdown formatting. Your response must begin with `{` and end with `}`. If you cannot determine a value, use `null`. Never invent data that is not supported by the input.

And then you *still* get occasional responses that start with "Here is the JSON you requested:" followed by the actual JSON. The output parser strips known preamble patterns with regex before attempting JSON parsing. On failure, it retries the same prompt with more explicit formatting instructions. After two retries, it falls back to extracting the JSON substring from the response using a bracket-matching algorithm.

This was more engineering effort than I expected for what sounded like "just get JSON back from a model."

### The Feedback Loop

Sometimes the LLM flags low confidence on a specific feature. "The area annotation doesn't match the computed area. The polyline might be open." That flag triggers a targeted re-query to PyAutoCAD: fetch this specific entity by handle, check whether it's actually closed, pull its exact vertex coordinates.

This creates a limited agentic loop without needing a full tool-use framework. The LLM is reporting anomalies; Python is going back to the data source to verify. It's not truly autonomous — there's no general tool use — but for this specific problem it works well.

For instance, if the LLM flags an anomaly where a computed area of 650 sq.m doesn't match the annotated area of 680 sq.m with low confidence, the script queries AutoCAD again for that specific entity handle. It might discover the polyline wasn't actually natively closed, making the COM area property unreliable. It then falls back to recomputing the area manually from the vertex array using the shoelace formula. If the recomputed area matches the annotation (e.g., 672 sq.m), the discrepancy flag is lowered. If it still doesn't, it's flagged for human review.

---

## Layer 4: Getting Data Out the Other End

### Image Placeholder

> 📸 **[SCREENSHOT PLACEHOLDER]**
> *Sample output: extracted lot polygons rendered in QGIS over base map tiles, colored by zone classification. Each polygon is labeled with its computed lot identifier and area in m².*

The final output targets two destinations.

**GeoJSON** for immediate consumption by web mapping tools and QGIS. Each extracted feature becomes a GeoJSON Feature with a geometry (the polygon in WGS84 if a CRS is known, or in local drawing coordinates otherwise) and a properties object containing everything extracted: plot/survey identifier, zone class, area, road frontage, margin/setback flags.

**Spatial database** — specifically PostGIS or SpatiaLite depending on the deployment — for integration with the broader town planning map pipeline. The schema here is canonical: known fields for known concepts. Plot/Survey identifier, TP Scheme number, zone classification, area (computed and annotated), DP road frontage, setback margins, special overlays (like Coastal Regulation Zone / CRZ).

### Area Reconciliation

One design decision I'm glad I made: area figures are never silently resolved. If the LLM-extracted annotation says `650 sq.m` and the computed polygon area says `648 sq.m`, I don't average them or pick one. I flag the discrepancy with both values and a delta percentage. Below a configurable tolerance (I use 2% by default), the discrepancy is logged but not flagged as an error. Above that tolerance, it's a human review item.

Area figures in planning documents have legal weight. They appear in sale deeds and RERA registrations. They determine whether a layout complies with minimum plot size and FSI (Floor Space Index) requirements set by the local authority. Getting them wrong silently is not acceptable.

---

## The Failure Modes That Actually Bit Me

### The COM Connection That Lied to Me

I spent three hours debugging why some features were coming out with coordinates in the ballpark of `(0.0, 0.0)` with areas of `0.0`. The COM connection was dropping silently under load — multiple rapid entity queries were overwhelming the LT COM server — and returning zero values instead of raising exceptions. The health check I mentioned earlier wasn't aggressive enough. Adding an exponential backoff retry on zero-value returns fixed it. In hindsight, rate-limiting my own COM queries was the correct solution.

### Drawing Quality Is Not What You Assume

I expected clean, well-maintained drawings with nice closed polylines for every parcel. I did not get that. What I got was drawings where plot boundaries were drawn as individual LINE segments — not LWPOLYLINE entities — with gaps between them. Visually, in AutoCAD, a plot looks like a closed shape. Programmatically, it's four separate lines that happen to be near each other, with endpoints that almost but don't quite coincide.

This was the single biggest structural problem in the pipeline. You cannot compute the area of four disconnected lines. You cannot do point-in-polygon tests on them. You cannot run a spatial join against them. They're not a shape — they're a drawing.

The solution was a clustering and loop-reconstruction step: snap nearby endpoints within a configurable tolerance, build a graph of connected line segments, and trace closed loops through that graph. Each closed loop becomes a synthetic polygon. This worked well enough for regular rectangular plots. It got harder for irregular parcel shapes and plots with curved boundaries involving ARC entities.

The other key input to this reconstruction step was the color-coded legend. The Vastral–Ramol plan, like most Gujarat TPS drawings, uses solid fill colors to mark zone types — residential, commercial, public purpose, weaker section housing, open space, road, waterbody. These aren't just visual decoration; they're the semantic signal for what the enclosed region *is*. A yellow-filled region is "Sale for Residence." A pink-filled region is EWS housing. By cross-referencing which color a region was filled with against the legend, I could assign zone classifications to reconstructed polygons even when the layer name alone was ambiguous.

Other drawing quality issues that also bit me:
- The same plot number appearing in two places because someone copied a label and forgot to update it
- Layer names with trailing spaces or mixed case, breaking the classification map
- HATCH entities referencing boundary paths that no longer existed in the model

Each required a specific defensive handling path. The lesson: drawings produced by humans, even professional draftspeople, are messier than you'd expect. Validate and reconstruct geometry before it goes anywhere near the LLM, because a hallucination about geometry that was already wrong in the source data is very hard to trace back.

### LLM Consistency Before Tool Calling

When the LLM was inconsistent about JSON structure — sometimes returning `"area_sqm": 650` and sometimes `"area": "650 sq.m"` — the merge step broke in interesting ways. The fix was tighter system prompts (examples of both valid and invalid format) and a schema validation step that rejects malformed extractions and triggers a retry. Eventually made the output reliable enough for production use.

---

## What the System Looks Like End to End

```
.dwg file (loaded in AutoCAD LT on Windows)
                │
                ▼
┌──────────────────────────────────────┐
│     LAYER 1: INGESTION               │
│  • COM connection (health-checked)   │
│  • Entity traversal (allow-listed)   │
│  • Layer classification map          │
│  Output: raw entity list + layer map │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│     LAYER 2: GEOMETRY                │
│  • Coordinate normalization          │
│  • Closed polyline → area            │
│  • Topology: adjacency, containment  │
│  • Text-geometry spatial join        │
│  Output: JSON feature list           │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│     LAYER 3: LLM REASONING           │
│  • 5-pass prompt pipeline            │
│  • Spatially coherent chunking       │
│  • Structured JSON enforcement       │
│  • Feedback loop → Layer 1           │
│  Output: semantically labeled        │
│          feature set                 │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│     LAYER 4: OUTPUT                  │
│  • Area reconciliation               │
│  • GeoJSON export                    │
│  • Spatial DB write                  │
│  • Human review flags                │
└──────────────────────────────────────┘
```

---

## The Tradeoffs I Made and Would Make Again

**COM over file parsing.** I could have used `ezdxf` to parse the DXF export of the drawing without needing AutoCAD to be running. I chose live COM instead because the DXF export from LT loses some entity properties and because the COM interface gives me the `Area` property for free on closed polylines. In hindsight, a hybrid approach — `ezdxf` for batch pre-processing, COM only for interactive verification — would have been more robust, but for the workload I was handling, live COM was fine.

**LLM for semantics, Python for geometry — strictly.** This division of labor is the rule I enforced most rigidly, and it's the one I'd enforce again. Every time I was tempted to ask the LLM "what is the area of this lot given these vertices" — which it can technically compute — I resisted. Python computes geometry. The LLM interprets meaning. When you let these responsibilities bleed into each other, you get bugs that are very hard to isolate because you don't know if the error is in the geometry computation or the semantic reasoning.

**Human review for legal data.** The system is designed to accelerate the work of a human reviewer, not to autonomously produce legal records. Every output that feeds into an official planning document goes through a review step. This was a deliberate scope decision, not a limitation. The system is fast and accurate enough to do the tedious extraction work. The judgment calls — "this discrepancy seems like a drawing error, not a survey error" — stay with a human.

---

## The Satisfaction of Making Something That Surprisingly Works

The first time the pipeline ran end-to-end on a real drawing — a 200-plot layout plan with fifteen zone types, multiple setbacks, and a title block in a custom layer nobody told me about — and produced a GeoJSON file that loaded correctly in QGIS with all plots labeled, correctly zoned, and with the right areas... it was genuinely surprising. Not because the engineering was exotic. It wasn't. But because each layer of the system was hiding its own complexity, and watching them work together on data they'd never seen before felt like the system understood something.

It didn't, of course. The LLM was pattern-matching on training data. The geometry code was running shoelace formulas. The topology builder was doing spatial indexing. None of it was understanding in the way that word usually implies.

But the output was correct. And for a problem that looked like it had no clean solution — an undocumented proprietary file format, a restricted API, human-authored data with no schema — that's not nothing.

---

*The source for this project is private, but the architecture is documented in the linked notes. If you're building something similar — reading CAD data for any kind of structured extraction — feel free to reach out.*