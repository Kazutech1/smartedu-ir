import { prisma } from '../prisma/client.js';

/** escape + highlight utils (keep as you have) */
const escapeHtml = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeRegExp = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const makeHighlighter = (q) => {
  const tokens = (q || '').split(/\s+/).filter(Boolean).sort((a, b) => b.length - a.length);
  if (!tokens.length) return (txt) => escapeHtml(txt || '');
  const reg = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi');
  return (txt) => escapeHtml(txt || '').replace(reg, (x) => `<mark>${x}</mark>`);
};

const makeSnippet = (rawText = '', q) => {
  if (!rawText) return null;
  const tokens = q.split(/\s+/).filter(Boolean);
  const regex = new RegExp(tokens.map(escapeRegExp).join('|'), 'i');
  const match = rawText.match(regex);
  if (!match) return null;
  const i = match.index;
  const start = Math.max(0, i - 80);
  const end = Math.min(rawText.length, i + 100);
  return `${start > 0 ? '…' : ''}${rawText.slice(start, end)}${end < rawText.length ? '…' : ''}`;
};

/** merge logic */
const mergeUnique = (exact = [], fuzzy = [], limit = 10) => {
  const seen = new Set(exact.map((x) => x.id));
  return [...exact, ...fuzzy.filter((x) => !seen.has(x.id))].slice(0, limit);
};

export const unifiedSearch = async (q, { limit = 10, mode = 'all' } = {}) => {
  const query = q.trim();
  if (!query) return { students: [], courses: [], documents: [] };

  const highlighter = makeHighlighter(query);

  // ---- EXACT SEARCH --------------------------------------------------------
  const [studentsExact, coursesExact, documentsExact] = await Promise.all([
    prisma.student.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { studentNumber: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit,
      select: { id: true, firstName: true, lastName: true, email: true, studentNumber: true }
    }),
    prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit,
      select: { id: true, title: true, code: true }
    }),
    prisma.document.findMany({
      where: {
        OR: [
          { filename: { contains: query, mode: 'insensitive' } },
          { rawText: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: { id: true, filename: true, mimeType: true, uploadedAt: true, fileSize: true, rawText: true },
      take: limit
    })
  ]);

  // ---- FUZZY SEARCH --------------------------------------------------------
  const threshold = 0.2;
  let studentsFuzzy = [], coursesFuzzy = [], documentsFuzzy = [];

  if (mode !== 'exact') {
    studentsFuzzy = await prisma.$queryRaw`
      SELECT id, "firstName", "lastName", email, "studentNumber",
      similarity("firstName", ${query}) as sim
      FROM "Student"
      WHERE similarity("firstName", ${query}) > ${threshold}
         OR similarity("lastName", ${query}) > ${threshold}
         OR similarity(email, ${query}) > ${threshold}
         OR similarity("studentNumber", ${query}) > ${threshold}
      ORDER BY sim DESC
      LIMIT ${limit};
    `;

    coursesFuzzy = await prisma.$queryRaw`
      SELECT id, title, code,
      similarity(title, ${query}) as sim
      FROM "Course"
      WHERE similarity(title, ${query}) > ${threshold}
         OR similarity(code, ${query}) > ${threshold}
      ORDER BY sim DESC
      LIMIT ${limit};
    `;

    documentsFuzzy = await prisma.$queryRaw`
      SELECT id, filename, "mimeType", "uploadedAt", "fileSize", "rawText",
      similarity(filename, ${query}) as sim
      FROM "Document"
      WHERE similarity(filename, ${query}) > ${threshold}
         OR similarity("rawText", ${query}) > ${threshold}
      ORDER BY sim DESC
      LIMIT ${limit};
    `;
  }

  // ---- RESULT BUILDING ----------------------------------------------------
  const useExact = mode === 'exact' || mode === 'all';
  const useFuzzy = mode === 'fuzzy' || mode === 'all';

  const students = useExact && useFuzzy ? mergeUnique(studentsExact, studentsFuzzy, limit)
    : useExact ? studentsExact
    : studentsFuzzy;

  const courses = useExact && useFuzzy ? mergeUnique(coursesExact, coursesFuzzy, limit)
    : useExact ? coursesExact
    : coursesFuzzy;

  const documents = useExact && useFuzzy ? mergeUnique(documentsExact, documentsFuzzy, limit)
    : useExact ? documentsExact
    : documentsFuzzy;

  return {
    students: students.map(s => ({
      id: s.id,
      firstName: highlighter(s.firstName),
      lastName: highlighter(s.lastName),
      email: highlighter(s.email),
      studentNumber: highlighter(s.studentNumber)
    })),
    courses: courses.map(c => ({
      id: c.id,
      title: highlighter(c.title),
      code: highlighter(c.code)
    })),
    documents: documents.map(d => ({
      id: d.id,
      filename: highlighter(d.filename),
      mimeType: d.mimeType,
      uploadedAt: d.uploadedAt,
      fileSize: d.fileSize,
      snippet: makeSnippet(d.rawText, query)
    }))
  };
};



export const logSearch = async ({ queryText, timeMs, resultCount, source = 'all' }) => {
  try {
    await prisma.searchLog.create({
      data: { queryText, timeMs: Number(timeMs || 0), resultCount, source },
    });
  } catch (_) {
    // Avoid crashing if logging fails
  }
};
