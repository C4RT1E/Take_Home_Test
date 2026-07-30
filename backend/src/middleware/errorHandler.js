/**
 * Centralized Express error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: 'Resource already exists' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({ error: message });
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res) => {
  return res.status(404).json({ error: `Route ${req.originalUrl} not found` });
};
