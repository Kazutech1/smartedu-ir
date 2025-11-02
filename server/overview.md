System Overview (What it does)

Your SmartEdU system is a hybrid information retrieval engine that searches structured data (Students, Courses, Grades) and unstructured data (PDFs with extracted text) through a single API. You support:

Exact keyword search (fast substring match)

Fuzzy search (typo-tolerant via PostgreSQL pg_trgm)

Combined mode (default behavior for the UI)

Result highlighting (<mark>…</mark>) and snippets (context window from PDFs)

Search logging + response time

Evaluation pipeline (Precision, Recall, F1, Response Time)

High-Level Architecture
flowchart LR
  subgraph Frontend [Next.js UI]
    A[SearchBar] --> B[Fetch /api/search]
    B --> C[Render Students/Courses/Documents]
    C --> D[Show <mark> highlights + snippets]
  end

  subgraph Backend [Node.js + Express]
    B --> E[/Controller: GET /api/search/]
    E --> F[Search Service\n(unifiedSearch)]
    F --> G1[Exact Query (Prisma)]
    F --> G2[Fuzzy Query (pg_trgm)]
    F --> H[Merge + Highlight + Snippet]
    H --> I[(Log Search + timeMs)]
  end

  subgraph Data [Storage]
    J[(PostgreSQL)]
    K[(File system / PDFs)]
  end

  G1 --> J
  G2 --> J
  F --> J
  Seeder[[Seeding + PDF Parsing (pdfjs)]] --> J
  Seeder --> K


Flow summary

Next.js sends /api/search?q=… (frontend defaults to combined search).

Controller calls unifiedSearch(q, {mode, limit}).

Service runs Exact (Prisma) and/or Fuzzy (SQL similarity) queries.

Results are merged, highlighted, and snippets are built from rawText.

Query and timing are logged for evaluation.

UI renders 3 groups: Students, Courses, Documents.

Request Lifecycle (Detailed Sequence)
sequenceDiagram
  participant UI as Next.js UI
  participant API as Express Controller
  participant SVC as Search Service
  participant DB as PostgreSQL
  UI->>API: GET /api/search?q=assignment
  API->>SVC: unifiedSearch(q, {mode:'all', limit:10})
  par Exact branch
    SVC->>DB: Prisma: students/courses/documents .contains(q)
    DB-->>SVC: exactResultSets
  and Fuzzy branch
    SVC->>DB: SQL: similarity(field, q) > threshold ORDER BY sim DESC
    DB-->>SVC: fuzzyResultSets
  end
  SVC->>SVC: mergeUnique(exact,fuzzy) + highlight + snippet
  SVC-->>API: {students[], courses[], documents[]}
  API->>DB: INSERT INTO SearchLog(query, timeMs, resultCount)
  API-->>UI: JSON { status, data, timeMs }

Core Components (What each piece does)
1) Data Ingestion

Structured: seeded Students, Courses, Enrollments, Grades (Prisma).

Unstructured (PDFs):

PDFs placed under /data/pdfs

pdfjs-dist extracts the first 1–2 pages of text → stored as Document.rawText

Document metadata: filename, mimeType, fileSize, uploadedAt, filePath

2) Search Service (unifiedSearch)

Exact search (Prisma):

Students: firstName, lastName, email, studentNumber with contains (case-insensitive)

Courses: title, code with contains

Documents: filename, rawText with contains

Fuzzy search (pg_trgm):

SQL similarity(field, q) > 0.2 (balanced threshold)

Ordered by similarity (DESC)

Merge strategy:

Exact results first, then fuzzy, de-duplicate by id, clip to limit

Highlighting: wraps matches with <mark>…</mark> (case-insensitive, partial token match)

Snippet: ~160 chars around first match in rawText (adds … where trimmed)

Modes:

mode=exact → exact only

mode=fuzzy → fuzzy only

mode=all (default; UI uses this) → combined

3) Controller (/api/search)

Validates q

Calls unifiedSearch(q, {limit, mode})

Computes resultCount

Logs to SearchLog: { queryText, timeMs, resultCount, source: mode }

Returns {status:'success', data, timeMs}

4) Frontend (Next.js App)

Simple search bar

Calls /api/search?q=… (no mode param in UI—backend defaults to combined)

Renders three sections with counts

Uses dangerouslySetInnerHTML to preserve <mark> highlights

Shows response time (from frontend timing or timeMs if you expose it)

Data Model (Key Tables)

Student(id, firstName, lastName, email, studentNumber)

Course(id, title, code, semester, year)

Enrollment(studentId, courseId, year, status)

Grade(enrollmentId, assessment, score)

Document(id, filename, mimeType, rawText, fileSize, uploadedAt, filePath, uploadedById)

User(id, name, email, role)

SearchLog(id, queryText, timeMs, resultCount, source, createdAt)

Exact vs Fuzzy (Under the hood)

Exact (Prisma):

where: {
  OR: [
    { firstName: { contains: q, mode: 'insensitive' } },
    { lastName:  { contains: q, mode: 'insensitive' } },
    ...
  ]
}


Fuzzy (SQL with pg_trgm):

SELECT id, title, code, similarity(title, $1) AS sim
FROM "Course"
WHERE similarity(title, $1) > 0.2 OR similarity(code, $1) > 0.2
ORDER BY sim DESC
LIMIT $2;


Merging:

Build Set(ids) from exact

Append fuzzy where id not seen

slice(0, limit)

Highlighting:

Build case-insensitive regex from tokens

Escape HTML → replace matches with <mark>…</mark>

Snippets (Documents):

Find first match position in rawText

Take ~80 chars left + ~80 right

Highlight within snippet

Evaluation Pipeline (Phase 5)
flowchart TB
  Q[Ground Truth JSON] --> E[Evaluation Script]
  E -->|for each query x mode| CALL[Call /api/search]
  CALL --> CMP[Compare with ground truth]
  CMP --> MET[Compute Precision/Recall/F1]
  MET --> CSV[Write evaluation-results.csv]
  MET --> CON[Console Table]
  CSV --> RPT[Insert into Report (tables/graphs)]


Ground truth: fixed JSON list of relevant (type,id) per query

Script: loops through queries × modes

Metrics: Precision, Recall, F1 + response time

Outputs: console summary + CSV for your report charts

End-to-End Example

Request

GET /api/search?q=assignment


Backend

Exact: finds files with “assignment” in filename or rawText

Fuzzy: catches misspellings like “asignment” if present

Merge, highlight <mark>assignment</mark>, produce snippet

Response (shape)

{
  "status": "success",
  "data": {
    "students": [],
    "courses": [],
    "documents": [
      {
        "id": 10,
        "filename": "CSC260_Web_Development_<mark>Assignment</mark>2.pdf",
        "snippet": "... analysis, <mark>assignment</mark> responses or research findings ..."
      }
    ]
  },
  "timeMs": 120
}

Presentation Script (2–3 minutes)

Slide 1 — Title

“SmartEdU: A Hybrid Information Retrieval System for Academic Data.”

Script:
This project implements a hybrid IR engine that searches structured student/course data and unstructured PDFs within a single interface. I’ll show the architecture, search flow, and evaluation outcomes.

Slide 2 — Architecture Diagram (the Flowchart above)
Script:
On the left is a minimal Next.js UI. It calls an Express /api/search endpoint. The backend runs both exact and fuzzy retrieval against PostgreSQL. For documents, I parse PDFs and store raw text. Results are merged, highlighted, and snippets generated. Every query is logged with response time for evaluation.

Slide 3 — Retrieval Methods
Script:
Exact search uses Prisma substring match—fast and precise for clean queries. Fuzzy search uses PostgreSQL’s trigram similarity, which is typo-tolerant. I merge exact-first with fuzzy as fallback, de-duplicate, and return up to N results.

Slide 4 — Result Formatting
Script:
I highlight matches using <mark> and build short snippets from document text around the first match, so users see context immediately.

Slide 5 — Evaluation Method
Script:
I created a ground-truth file for 10 queries spanning structured and unstructured targets. The evaluation script hits the API in three modes—exact, fuzzy, combined—and computes Precision, Recall, F1, and time, exporting a CSV for the report.

Slide 6 — Key Results
Script:
Structured lookups like “John” achieve perfect F1. Combined mode generally balances precision and recall best. Fuzzy adds robustness to misspellings but can degrade precision on generic academic terms—this matches IR theory expectations.

Slide 7 — Limitations & Future Work
Script:
Dataset is small and PDFs are synthetic; embeddings or BM25 would likely improve ranked retrieval for longer documents. Future work includes a richer course catalog, description fields, and a better ranking function.

Slide 8 — Live Demo
Script:
I’ll run /api/search?q=john, /api/search?q=jhn to show fuzzy recovery, and /api/search?q=assignment to show snippets in documents. Finally, I’ll run the evaluation script to show the metrics table and CSV output.

Done.