import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todos.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/todos', todoRoutes);

// 404 Catch-all
app.use(notFoundHandler);

// Centralized Error Handling
app.use(errorHandler);

export default app;
