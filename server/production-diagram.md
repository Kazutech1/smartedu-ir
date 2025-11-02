┌──────────────────────────────┐
│          User / UI           │
│  Search Interface (Web App)  │
│  • Enter query               │
│  • Select search mode        │
│  • View results & snippets   │
└──────────────┬───────────────┘
               │ HTTP Request (/search?q=...&mode=...)
               ▼
┌──────────────────────────────┐
│         Express API          │
│  Controllers (search, data)  │
│  • Parse query               │
│  • Route to services         │
│  Middleware                  │
│  • CORS / JSON parsing       │
│  • Logging + response time   │
└──────────────┬───────────────┘
               │ Service Calls
               ▼
┌──────────────────────────────┐
│     Search Service Layer     │
│  unifiedSearch(query, mode)  │
│  • Keyword match (exact)     │
│  • Fuzzy match (pg_trgm)     │
│  • Highlighting & snippets   │
│  • Merge + rank results      │
└──────────────┬───────────────┘
               │ Prisma ORM Queries
               ▼
┌──────────────────────────────────────┐
│           PostgreSQL + Prisma        │
│ Structured Tables:                   │
│   • Student(id, name, email, …)      │
│   • Course(id, title, code, …)       │
│ Unstructured Table:                  │
│   • Document(id, filename, rawText)  │
│ Extensions: pg_trgm for fuzzy match  │
│ Search Logging table                 │
└──────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Evaluation Layer      │
│ Node evaluation script       │
│ • Sends test queries         │
│ • Measures precision/recall  │
│ • Writes CSV results         │
└──────────────────────────────┘
