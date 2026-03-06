# AutoCAD LLM Controller — Architecture & Planning Decision Outline

## Project Overview

A system that bridges PyAutoCAD with LLM reasoning to automate the interpretation of 2D AutoCAD LT drawings — specifically for town planning workflows where identifying spatial features and extracting area/boundary data from DWG files feeds into broader map analysis pipelines.

---

## 1. Problem Framing & Constraints

The core challenge is that AutoCAD LT exposes very limited automation APIs compared to full AutoCAD. There's no LISP runtime, no .NET API, and COM automation support is restricted. PyAutoCAD wraps the COM interface (win32com under the hood), so the strategy has to be designed around what that interface actually gives you — primarily read access to the model space entity collection, layer information, block references, and basic geometry properties.

The LLM is not "seeing" the drawing in the traditional sense. It's reasoning over structured data extracted from entities, which means your pipeline is fundamentally about transforming raw CAD geometry into semantically rich text that a language model can work with meaningfully.

---

## 2. High-Level Architecture

The system is organized into four logical layers that data flows through sequentially, with a feedback path from the LLM back into the extraction layer for follow-up queries.

**Layer 1 — Ingestion & Entity Extraction**
**Layer 2 — Geometry Normalization & Structuring**
**Layer 3 — LLM Reasoning & Semantic Extraction**
**Layer 4 — Output & Town Plan Integration**

---

## 3. Layer 1: Ingestion & Entity Extraction

### PyAutoCAD Connection Strategy

The system connects to a running AutoCAD LT instance via COM. This means AutoCAD LT must be open with the target drawing already loaded — there's no headless mode. The connection is managed as a singleton with health-check logic, because COM connections against LT are fragile and prone to silent disconnection.

### Entity Traversal

The model space is iterated entity by entity. Key entity types to handle:

- **LWPOLYLINE / POLYLINE** — the primary carrier of boundary and parcel data in town plan drawings
- **LINE** — individual wall segments, road edges, utility lines
- **ARC and CIRCLE** — roundabouts, cul-de-sacs, curved boundaries
- **TEXT and MTEXT** — parcel numbers, zone labels, area annotations, street names
- **INSERT (Block References)** — symbols for trees, utilities, north arrows, title blocks
- **HATCH** — zone fill patterns that carry semantic meaning about land use
- **DIMENSION** — setback lines, road widths

### Layer-Based Filtering

Layers in a well-structured town plan drawing are your primary semantic index. Before any geometry parsing happens, the system reads all layer names and builds a classification map. Layers named things like `BOUNDARY`, `ROAD_EDGE`, `LOT`, `EASEMENT`, `CONTOUR` give you a head start on what each entity represents before the LLM is even involved.

The planning decision here is to treat layer names as first-class metadata rather than incidental properties. The LLM later uses layer context heavily.

### Limitations to Design Around

PyAutoCAD via LT COM cannot access: rendering/visual styles, external references (XREFs) in some versions, embedded OLE objects, or custom object types from third-party applications. The extraction layer needs graceful fallbacks and entity-type allow-listing to avoid crashes on unsupported types.

---

## 4. Layer 2: Geometry Normalization & Structuring

### Coordinate Normalization

Raw CAD coordinates are in drawing units (usually millimeters or meters at survey scale). The normalization step converts everything to a consistent real-world unit, applies any known coordinate system offsets, and optionally transforms to a geographic CRS if the drawing has a known survey datum embedded in its title block or attributes.

### Closed Polyline → Area Extraction

Closed LWPOLYLINE entities are the primary source of parcel and zone areas. Area can be read directly from the COM object via the `Area` property when it's a closed polyline — this is reliable for simple polygons. For complex or self-intersecting cases, the system falls back to the shoelace formula computed from the vertex array.

### Topology Building

Individual line segments and polylines are assembled into a topological graph. The decision to build topology locally (before sending anything to the LLM) is important — it keeps the LLM prompt sizes manageable and offloads computational geometry to Python where it belongs. The topology graph captures: which boundaries are shared between parcels, which parcels are adjacent, which entities are spatially contained within others.

### Text-Geometry Association

Text entities are associated with their nearest enclosing or adjacent geometric feature. This is a spatial join — for each TEXT entity, find the closed polyline that contains its insertion point, or if none contains it, find the closest polyline centroid within a threshold distance. This association is what lets the LLM later know that "Lot 42 — 650m²" is the label for a specific polygon.

### Hatch-Layer Semantic Mapping

HATCH entities are matched back to their boundary paths (via the hatch boundary loop data) and tagged with their layer name and pattern name. A hatch with pattern `ANSI31` on layer `RESIDENTIAL` carries different semantic weight than one on `INDUSTRIAL`.

### Structured Output Format

The output of Layer 2 is a structured intermediate representation — essentially a list of spatial features, each with: entity type, layer, geometry summary (centroid, bounding box, area if applicable, vertex count), associated text labels, adjacent feature IDs, and hatch pattern if applicable. This is serialized as JSON for handoff to Layer 3.

---

## 5. Layer 3: LLM Reasoning & Semantic Extraction

### Why an LLM Rather Than Rules

Town plan drawings are not standardized. Different councils, surveyors, and drafting offices use different layer naming conventions, different abbreviation styles, and different drawing organization conventions. A rule-based system would need constant maintenance. The LLM handles the fuzzy interpretation — recognizing that `RES_A`, `ZONE-RESIDENTIAL`, and `R1` on a hatch layer all mean the same thing, or that a TEXT entity reading `Lot 7 DP 112345` is a lot identifier following a Deposited Plan reference format.

### Prompt Architecture

Since MCP didn't exist, the integration pattern is direct API calls to the LLM provider (OpenAI, Anthropic, etc.) with carefully constructed prompts. The prompt design is the most critical engineering decision in this layer.

**System Prompt Design**
The system prompt establishes the LLM as a spatial data analyst with town planning domain knowledge. It defines the input format (the JSON feature list), the expected output format (structured JSON with specific fields), and gives examples of the naming conventions and abbreviations common in planning drawings. Crucially, it instructs the model to reason about spatial relationships, not just individual entities.

**Chunked Context Strategy**
Large drawings can have thousands of entities. The full structured representation won't fit in a single context window. The chunking strategy is spatially aware — features are grouped by proximity (using the bounding box data) so that related entities (a lot polygon, its label text, its hatch fill, its boundary shared with a road) appear in the same chunk. The LLM processes each chunk and produces partial extractions, which are merged in a post-processing step.

**Task Decomposition**
Rather than one monolithic prompt asking "tell me everything about this drawing," tasks are decomposed into a pipeline of focused prompts:

1. **Classification pass** — given the layer list and a sample of entity data, classify what type of drawing this is (subdivision plan, zoning map, site plan, etc.) and identify the naming conventions in use
2. **Feature identification pass** — identify all distinct spatial features (parcels, roads, zones, easements, utilities) and assign semantic labels
3. **Area extraction pass** — for each identified parcel or zone, confirm or calculate its area, cross-referencing the computed geometry area against any annotated area text
4. **Relationship extraction pass** — identify adjacency relationships, containment (lots within a zone), access points (which lots have frontage to which roads)
5. **Anomaly detection pass** — flag entities that don't fit the identified pattern (unlabeled parcels, area mismatches between annotation and computed geometry, unclosed boundaries)

**Structured Output Enforcement**
The LLM is prompted to respond strictly in JSON matching a defined schema. At this point in time (pre-function calling era for many providers), this meant detailed prompt instructions and output parsing with validation and retry logic for malformed responses.

### Feedback Loop

When the LLM's extraction pass returns low-confidence results or flags anomalies, the system can issue targeted follow-up queries back to Layer 1 — asking PyAutoCAD to re-examine specific entities (by handle), retrieve additional properties, or zoom to a region for visual inspection. This creates a limited agentic loop without needing a full tool-use framework.

---

## 6. Layer 4: Output & Town Plan Integration

### Canonical Feature Schema

The final output is normalized against a canonical schema for town planning features: parcels with lot/plan identifiers, computed and annotated areas, zone classifications, frontage measurements, easements with type and width, road reserves with centerline geometry, and utility corridors.

### Area Reconciliation

A reconciliation step compares LLM-extracted area annotations against the programmatically computed polygon areas. Discrepancies beyond a configurable tolerance are flagged for human review rather than silently resolved, because area figures in town planning documents have legal weight.

### GIS Export Path

The extracted features are exported to formats consumable by GIS tools. The two primary targets are GeoJSON (for web mapping and QGIS workflows) and a simple spatial database schema (PostGIS or SpatiaLite). Coordinate transformation to the appropriate geographic CRS happens here, using the datum information extracted from the title block or provided as a configuration parameter.

### Town Plan Map Integration

The extracted parcels and zones feed into the town plan map layer as polygon features with attribute tables containing: lot identifier, zone classification, area, any special overlays (flood, heritage, bushfire), and road frontage. The map integration layer is essentially a write path to whatever the target GIS or mapping system is — it's intentionally decoupled from the extraction pipeline so different map backends can be swapped without touching the core logic.

---

## 7. Key Planning Decisions & Tradeoffs

**COM over file parsing** — The decision to use live COM automation rather than parsing DWG files directly (via a library like ezdxf) was driven by LT compatibility. However, COM requires a running GUI instance and is Windows-only. A hybrid approach using ezdxf for batch pre-processing and COM only for interactive querying would be more robust in retrospect.

**LLM for semantics, Python for geometry** — The hard rule that the LLM never computes geometry (areas, distances, intersections) and Python never makes semantic judgments about what a feature means keeps the system maintainable. Violations of this separation are where bugs and hallucinations compound each other.

**Chunked spatial context over document-level context** — Spatially coherent chunks outperform arbitrary token-limit-based chunking significantly for this use case, because the relationships between entities (label ↔ polygon, hatch ↔ boundary) need to be co-present in the context window for the LLM to reason about them correctly.

**Human-in-the-loop for legal data** — Area figures and lot identifiers that feed into official town plan records should always pass through a review step. The system is designed as a drafting and extraction accelerator, not an autonomous generator of planning data.

---

## 8. Failure Modes & Mitigations

The COM connection to AutoCAD LT is the single most fragile point — mitigated by connection pooling with automatic reconnect and operation retry logic. Drawing quality varies enormously in practice — unclosed polylines, duplicate entities, and missing layers are common, requiring defensive geometry validation before anything reaches the LLM. LLM output consistency for structured JSON was a real challenge before native tool-use/function-calling APIs were available — mitigated by output validation, regex-based extraction fallbacks, and retry with more explicit formatting instructions on failure.

---

## 9. Future Extension Points

The architecture was designed with clear seams for later enhancement: replacing the direct LLM API calls with a proper tool-use or agentic framework once those became available, adding support for full AutoCAD (not just LT) to unlock LISP scripting and the richer .NET API, integrating optical character recognition for scanned plan images as an additional ingestion path, and connecting the GIS export directly to a live council GIS platform rather than file-based exchange.