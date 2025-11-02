What the function is trying to achieve

One endpoint /api/search?q=... that returns students, courses, and documents together.

It combines:

Exact keyword search (fast, precise)

Fuzzy search using PostgreSQL trigram similarity (tolerates typos)

It merges both result sets (exact first, then fuzzy), de-duplicates by id, and highlights matched text using <mark>…</mark>.

For documents, it also returns a short snippet from rawText showing context around the match.

This gives you a search that feels smart without overcomplicating infra.

The moving parts (section-by-section)
1) Utilities
escapeHtml(s)

Escapes &, <, > so your <mark> tags don’t break or become unsafe.

We do this before applying highlight to avoid HTML injection from raw data.

makeHighlighter(q)

Builds a case-insensitive regex from the user query.

Splits the query by spaces → makes a pattern like (physics|database) (longer tokens first so the biggest match gets marked).

Returns a function that wraps matched parts with <mark>…</mark>.

Example: q = "databse" → "Introduction to Database" → Introduction to <mark>Datab</mark>ase

makeSnippet(rawText, q)

Finds the first occurrence of any token in rawText.

Extracts ~160 chars around the hit (80 before + 80 after), adds … ellipses if trimmed.

Highlights matches inside the snippet using the same highlighter as above.

Keeps the payload small and useful for documents.

mergeUnique(exact, fuzzy, limit)

Keeps exact results first, then appends fuzzy results that don’t duplicate IDs.

Trims to the limit you passed into the function.

2) Exact search (Prisma)

For each model:

Students: matches firstName, lastName, email, studentNumber.

Courses: matches title, code.

Documents: matches filename, rawText (so you can find content in PDFs you’ve parsed).

Uses Prisma .findMany({ where: { …contains…, mode: 'insensitive' } }).

This is the fast, baseline search that catches obvious, correct queries.

Why keep it?

It’s lightweight, index-friendly, and often “good enough.”

You wanted simple sorting — so orderBy is deterministic (id asc / uploadedAt desc).

3) Fuzzy search (Postgres pg_trgm)

Uses $queryRaw (Prisma) to run SQL against your real table names ("Student", "Course", "Document").

Functions used: similarity(field, query) > threshold.

Threshold = 0.2 (Balanced)

We measured similarity('john','jhn') ≈ 0.2857, so 0.2 is a safe cut for common typos.

If you set it too high: you’ll miss typos ("jhn" won’t match “John”).

Too low: results get noisy.

Fields checked:

Students: firstName, lastName, email, studentNumber

Courses: title, code

Documents: filename, rawText

Why $queryRaw?

Prisma doesn’t have native trigram similarity operators yet. $queryRaw lets you use Postgres features safely.

4) Merge + Highlight

After you get exact and fuzzy lists:

mergeUnique() removes duplicates (by id) and keeps exact-first order.

We apply highlighting to the fields you asked for:

Students: firstName, lastName, email, studentNumber

Courses: title, code

Documents: filename + snippet (built from rawText, not full text)

Highlighting is case-insensitive and partial (only matched part is wrapped).

All text is escaped before marking, so <mark> is the only HTML you inject.

Example flow (with real-ish data)

Query: q=jhn

Exact:

Students with “jhn” in fields? Probably none.

Courses with “jhn”? None.

Documents with “jhn”? None.

Fuzzy:

similarity('John','jhn') > 0.2 → yes

Returns student rows like { firstName: 'John', lastName: 'Michaels' }

Merge → just those fuzzy students.

Highlight:

firstName: " <mark>Joh</mark>n "

If email matched: email: " <mark>john</mark>.doe@example.com"

Documents:

If rawText contains “database” and you searched databse, you’ll get:

filename: "Intro to <mark>Database</mark>.pdf"

snippet: "…the <mark>database</mark> system provides ACID guarantees…"

Why this is good for your coursework

Part A.1 – System architecture:

Integrates structured (students, courses) and unstructured (documents + raw text) search in one endpoint.

Part A.2 – Retrieval methods:

Shows keyword search (Prisma contains) + fuzzy search (pg_trgm).

You can mention trade-offs (fast exact vs tolerant fuzzy).

Part A.3 – Handling data types:

Clear handling for structured tables vs unstructured PDF text (rawText), plus snippet.

Part A.4 – Functionality demo:

Screenshots of /api/search responses with <mark> highlights and snippet are perfect evidence.

Part B – Evaluation (soon):

You’re logging searches (logSearch) → use this to report response time, hit rate, precision/recall on a test set.

Performance notes (so you don’t get caught later)

Indexes: For exact search, make sure you’ve got indexes on:

Student(firstName), (lastName), (email), (studentNumber)

Course(title), (code)

Document(filename)

If rawText is big, consider GIN trigram index on rawText or move to full-text search for scale.

Trigram speed:
Add trigram indexes for fields you fuzzy-search often:

CREATE INDEX IF NOT EXISTS student_first_trgm ON "Student" USING GIN ("firstName" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS student_last_trgm  ON "Student" USING GIN ("lastName" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS student_email_trgm ON "Student" USING GIN (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS student_no_trgm    ON "Student" USING GIN ("studentNumber" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS course_title_trgm  ON "Course"  USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS course_code_trgm   ON "Course"  USING GIN (code gin_trgm_ops);

CREATE INDEX IF NOT EXISTS doc_file_trgm      ON "Document" USING GIN (filename gin_trgm_ops);
CREATE INDEX IF NOT EXISTS doc_text_trgm      ON "Document" USING GIN ("rawText" gin_trgm_ops);


You can apply these via a migration. They’ll make fuzzy search much faster on larger sets.

Threshold tuning:
0.2 is a solid “balanced” default. If results feel noisy, bump to 0.25; if too strict, drop to 0.18. You can also scale threshold by query length (short words need lower thresholds).

Security + formatting cautions

You’re returning HTML in JSON (the <mark> tags). In the frontend, render carefully:

If React: render via a safe component that only accepts <mark> and text.

You already escape everything else, so the only HTML is <mark>.

Don’t send full rawText back to clients. You’re not doing that — you send snippet only. Good.

How to test quickly

GET /api/search?q=jhn → should find “John …”

GET /api/search?q=databse → should find “Database …” (courses/documents)

GET /api/search?q=physcs → should find “Physics …”

Try an exact term too: GET /api/search?q=Computer Science

Grab 2–3 responses with <mark> and snippet — that’s your Part A.4 screenshots.