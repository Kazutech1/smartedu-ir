import { Router } from 'express';
import studentRoutes from './student.routes.js';
import documentRoutes from './document.routes.js';
import searchRoutes from './search.routes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ status: 'success', data: { name: 'SmartEdU IR API', version: '1.0.0' } });
});

router.use('/students', studentRoutes);
router.use('/documents', documentRoutes);
router.use('/search', searchRoutes);

export default router;
