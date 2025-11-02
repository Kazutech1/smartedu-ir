import { prisma } from '../prisma/client.js';

export const listStudents = async ({ q, skip, take }) => {
  const where = q
    ? {
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName:  { contains: q, mode: 'insensitive' } },
          { email:     { contains: q, mode: 'insensitive' } },
          { studentNumber: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.student.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
    prisma.student.count({ where }),
  ]);

  return { items, total };
};
