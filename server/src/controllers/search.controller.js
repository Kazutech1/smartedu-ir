// import { logSearch, unifiedSearch } from '../service/search.service.js';
import { logSearch, unifiedSearch } from '../service/search.service.js';
import { asyncHandler, sendSuccess } from '../utils/http.js';

export const searchAll = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  const limit = Number(req.query.limit) || 10;
  const mode = (req.query.mode || 'all').toLowerCase(); // ✅ added mode support here

  if (!q) {
    return sendSuccess(res, { students: [], courses: [], documents: [] }, res.locals.timeMs);
  }

  // ✅ Pass mode into unifiedSearch
  const results = await unifiedSearch(q, { limit, mode });

  // compute total count for logging
  const total =
    (results.students?.length || 0) +
    (results.courses?.length || 0) +
    (results.documents?.length || 0);

  // log search (optional source field updated with mode)
  logSearch({ queryText: q, timeMs: res.locals.timeMs, resultCount: total, source: mode });

  return sendSuccess(res, results, res.locals.timeMs);
});
