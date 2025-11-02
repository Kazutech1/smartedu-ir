import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './middleware/logger.js';
import { responseTimer } from './middleware/logger.js';
import api from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(responseTimer);

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', timeMs: res.locals.timeMs ?? null, data: { uptime: process.uptime() } });
});

// mount api
app.use('/api', api);

// 404
app.use((req, res) => res.status(404).json({ status: 'error', message: 'Route not found', timeMs: res.locals.timeMs ?? null }));

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('🔥 Error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error', timeMs: res.locals.timeMs ?? null });
});

export default app;
