import { prisma } from '../prisma/client.js';

export const listDocuments = async ({ q, skip, take }) => {
  const where = q
    ? {
        OR: [
          { filename: { contains: q, mode: 'insensitive' } },
          // rawText might be null for some PDFs; still safe to search
          { rawText:  { contains: q, mode: 'insensitive' } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.document.findMany({
      where, skip, take,
      orderBy: { uploadedAt: 'desc' },
      select: { id: true, filename: true, mimeType: true, uploadedAt: true, fileSize: true, rawText: true }
    }),
    prisma.document.count({ where }),
  ]);

  return { items, total };
};
