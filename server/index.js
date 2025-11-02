import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import responseTime from 'response-time';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'SmartEdU Information Retrieval System is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    status: 'error'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Internal server error',
    status: 'error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartEdU IR Server is running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🌐 API accessible at http://localhost:${PORT}`);
});

export default app;
