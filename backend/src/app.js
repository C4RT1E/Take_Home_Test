import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todos.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware - Enable CORS for all origins and HTTP methods
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
);

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
