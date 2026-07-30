import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todos.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Todo Tracker API',
    status: 'online',
    endpoints: {
      todos: 'GET, POST /todos',
      todoById: 'PUT, DELETE /todos/:id',
      health: 'GET /health'
    }
  });
});

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
