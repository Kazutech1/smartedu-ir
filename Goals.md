🧩 PROJECT OVERVIEW

Goal:
Build a prototype Academic Information Retrieval (IR) System for SmartEdU that allows lecturers/administrators to:

Search across student records, courses, grades (structured)

Search across assignments, reports, feedback PDFs (unstructured)

Retrieve accurate results quickly using keyword or full-text search.

Tech Stack (recommended):

Backend: Node.js (Express)

Database:

Structured data → PostgreSQL or MySQL

Unstructured data → Local file storage or MongoDB GridFS

Search Engine: ElasticSearch (preferred) or Fuse.js for simplicity

Text Extraction: pdf-parse or textract for reading unstructured files

Evaluation Metrics: Implement precision, recall, and response time testing

Frontend (optional but good for demo): React or simple HTML/Bootstrap UI

🗓️ DEVELOPMENT ROADMAP (6-week structured plan)
Week	Focus Area	Tasks & Deliverables
Week 1	Project Setup & Requirements Analysis	- Create project folder structure.
- Initialize Node.js project (npm init).
- Install core dependencies: express, pg or mysql2, mongoose, pdf-parse, elasticsearch.
- Write a short system requirements document (for your report).
- Identify sample datasets: create fake student records, courses, grades, and some sample PDF files (assignments, feedback).
Week 2	Database & Data Handling	- Design relational DB schema (students, courses, grades).
- Implement PostgreSQL models and seed data.
- Store unstructured documents in a folder or MongoDB collection.
- Write a document parser to extract text from PDFs using pdf-parse.
- Store parsed content + metadata (filename, type, date, etc.).
Week 3	Search Index & Retrieval Methods	- Implement keyword search for structured data (SQL LIKE or full-text index).
- Implement unstructured data indexing using ElasticSearch or Fuse.js.
- Create a unified search endpoint /search?q=term that merges results from both structured and unstructured sources.
- Return ranked results (optional).
Week 4	System Architecture & Integration	- Create clear routes: /students, /documents, /search.
- Build middleware for logging and error handling.
- (Optional) Add a small frontend (React or EJS templates).
- Document architecture (draw diagrams and describe in report).
Week 5	Testing & Evaluation	- Test retrieval performance (response time per query).
- Evaluate accuracy and relevance (manually or using sample queries).
- Compute basic metrics: Precision, Recall, F1-score.
- Record results and screenshots for the report.
Week 6	Final Report & Screencast	- Write your full report (Part A–D).
- Record screencast (5–7 mins) showing: problem, system overview, demo, evaluation, reflections.
- Proofread and format report (Times New Roman, 12pt, 1.5 spacing).
- Submit final PDF and video link.
⚙️ SYSTEM FLOWCHART

Here’s the conceptual flow of your Information Retrieval System:

                ┌───────────────────────────────┐
                │       User/Client (UI)        │
                │  e.g., Lecturer or Admin      │
                └──────────────┬────────────────┘
                               │
                      Search Query (e.g. "John Smith grades")
                               │
                               ▼
           ┌───────────────────────────────┐
           │     Node.js Server (API)      │
           │       Express Framework        │
           └──────────────┬────────────────┘
                          │
          ┌───────────────┴─────────────────────┐
          │                                     │
          ▼                                     ▼
┌───────────────────────────┐       ┌───────────────────────────┐
│   Structured Data Layer   │       │  Unstructured Data Layer  │
│ (PostgreSQL/MySQL DB)     │       │ (PDFs, Docs, MongoDB)     │
│ - Students                │       │ - Extracted text via      │
│ - Courses                 │       │   pdf-parse / textract    │
│ - Grades                  │       │ - Indexed via Elastic/Fuse│
└────────────┬──────────────┘       └────────────┬──────────────┘
             │                                   │
             ▼                                   ▼
     Query structured tables              Query unstructured index
        (SQL / LIKE / FTS)               (keyword / semantic search)
             │                                   │
             └──────────────┬────────────────────┘
                            ▼
           ┌───────────────────────────────────┐
           │ Merge & Rank Combined Results      │
           │ (by relevance, type, or timestamp) │
           └────────────────┬───────────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │   Response to Client (UI)   │
              │  JSON or HTML display       │
              └─────────────────────────────┘

📑 HOW TO WRITE EACH SECTION IN YOUR REPORT
Part A: Design & Development

System Architecture: Include the flowchart above + your explanation.

Retrieval Methods: Explain your keyword/full-text search logic, e.g., ElasticSearch indexing, SQL full-text search.

Handling Structured vs. Unstructured: Describe your integration process.

Functionality: Add screenshots of:

Search interface

Database entries

Query result display

Part B: Implementation & Evaluation

Comparison: Compare SQL search vs. document search (speed, relevance).

Testing: Record test times, accuracy, recall.

Reflection: Note limitations (e.g., large file handling) and future improvements (e.g., NLP semantic search, AI chat assistant).

Part C: Screencast

Show yourself explaining slides and live demo.

Use Zoom or Loom.

Part D: Organisation

Ensure proper flow, referencing, and visuals.

🧠 Example Directory Structure
smartedu-ir/
├── backend/
│   ├── app.js
│   ├── routes/
│   │   ├── search.js
│   │   ├── students.js
│   ├── models/
│   │   ├── studentModel.js
│   ├── services/
│   │   ├── pdfParser.js
│   │   ├── searchService.js
│   ├── db/
│   │   ├── connection.js
│   ├── utils/
│   │   ├── evaluation.js
│   ├── uploads/
│   │   ├── sample_pdfs/
├── frontend/ (optional)
│   ├── index.html
│   ├── search.js
└── README.md

🧾 Evaluation Metrics Example (for your report)
Metric	Description	Example Result
Precision	% of retrieved results that are relevant	0.86
Recall	% of relevant results successfully retrieved	0.78
F1-score	Harmonic mean of Precision & Recall	0.82
Average Response Time	Time taken to retrieve results	0.45 sec



use pdf parser to store samples









