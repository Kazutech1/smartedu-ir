import { listDocuments } from '../service/document.service.js';
import { asyncHandler, sendSuccess } from '../utils/http.js';

export const getDocuments = asyncHandler(async (req, res) => {
  const { q = '', page = 1, limit = 20 } = req.query;
  const take = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const { items, total } = await listDocuments({ q, skip, take });
  return sendSuccess(res, { total, page: Number(page), limit: take, items }, res.locals.timeMs);
});
