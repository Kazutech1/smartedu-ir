PROJECT LOG – SmartEdU Academic Information Retrieval System

Summary Progress Table:

Phase	Description	Status
Phase 1	Requirements Analysis & System Architecture	Completed
Phase 2	Database Design & Structured Data Storage	Completed
Phase 3	Unstructured Data Processing & PDF Text Extraction	Completed
Phase 4	Search Engine Development (Keyword + Fuzzy Search)	Completed
Phase 5	Retrieval Evaluation (Precision, Recall, Speed)	Pending
Phase 6	Testing & Quality Assurance	Pending
Phase 7	Report Documentation	In Progress
Phase 8	Screencast Implementation	Pending

Phase 1 – Requirements Analysis and System Architecture
I began the project by analysing the retrieval needs of SmartEdU College as described in the coursework brief. The main challenge identified was the institution’s difficulty in searching and retrieving academic information across both structured data (student records, course data) and unstructured data (PDF academic documents, reports, feedback). Based on this, I defined a system architecture that integrates a unified search layer operating across two data repositories: a relational database for structured storage and a document store for unstructured files.

The architecture follows a modular design using a service-oriented approach. The backend was built with Node.js and Express, Prisma ORM was selected as the data access layer, and PostgreSQL was chosen for persistent storage due to its advanced support for text search extensions. The system also incorporates file processing and a search service layer to support scalable retrieval operations. This architectural setup aligns with Information Retrieval (IR) design principles discussed by Manning et al. (2008), which emphasise indexing, document representation, and ranked retrieval.

Phase 2 – Database Design and Structured Data Management
In this phase, I implemented the structured data component using PostgreSQL. I designed the schema to include core academic entities: Student, Course, Enrollment, Grade, Document, and SearchLog. The schema was implemented using Prisma ORM, enabling strict typing, data validation, and clean query abstraction. I also implemented relational integrity using foreign keys between students and course enrollments to support realistic academic queries.

A SearchLog table was introduced specifically to support retrieval evaluation later in the project. This allows me to record search queries, result counts, and search response time for precision, recall, and performance measurement in Part B of the coursework. Using Prisma for database migrations ensured schema evolution was consistent and traceable throughout development. This phase completed the structured data foundation required by Learning Outcome 2.

Phase 3 – Unstructured Data Handling and Text Extraction
This phase addressed unstructured academic documents such as research reports, assignments, and departmental notices stored as PDF files. Since PostgreSQL can only perform text search on searchable fields, I implemented a document preprocessing pipeline that extracts raw text content from uploaded PDF files using a PDF parsing library. The extracted raw text is stored in the rawText field of the Document model, making it searchable later using query matching.

This phase ensured that my system aligns with IR requirements for unstructured data retrieval. By converting documents into searchable text form, I adhered to established IR principles of document parsing and representation (Büttcher, Clarke & Cormack, 2016). This also prepares for future enhancements like TF-IDF weighting or full-text indexing. With this functionality in place, the system can now handle both structured and unstructured data sources, fulfilling Part A.3 of the specification.

Phase 4 – Search Engine Development (Keyword + Fuzzy Search)
The search system was implemented as a unified search endpoint capable of retrieving results from Students, Courses, and Documents in a single query. I began with keyword-based search using Prisma’s case-insensitive contains filter for basic substring matching. However, keyword search alone is limited and does not tolerate user spelling mistakes.

To enhance retrieval quality, I implemented fuzzy search using PostgreSQL’s pg_trgm trigram similarity algorithm. This enables typo-tolerant search by retrieving approximate string matches (e.g., "jhn" returns "John"). I used similarity(field, query) > 0.2 as a balanced similarity threshold after testing accuracy.

I also implemented a response formatter that highlights matched terms using <mark> tags to improve usability during result display. Finally, I generated contextual text snippets for document search results so users can preview the relevant part of a PDF document. This phase completes an important IR milestone by achieving hybrid retrieval that supports both structured records and text documents.

Phase 5 – Retrieval Evaluation (Planned)
In the next phase, I will evaluate system effectiveness using standard IR metrics: precision, recall, and query response time. Using data logged in the SearchLog table, I will measure query performance and compare exact vs fuzzy matching search. I will also compare retrieval behaviour across structured and unstructured data. This directly aligns with coursework Part B requirements.

Phase 6 – Testing and Quality Assurance (Planned)
This phase will focus on API testing using Postman and performance testing with sample academic queries. I will verify correctness, handle edge cases, and evaluate system robustness for incomplete and misspelled queries. Automated testing may be introduced using Jest if required.