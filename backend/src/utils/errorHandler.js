/**
 * Centralized Error Handler
 * 
 * Why centralized:
 * - Consistent error responses
 * - Easier debugging
 * - Can log errors to monitoring service
 * - Production-ready error handling
 */

export const errorHandler = (err, req, res, next) => {
  // Log error (in production, send to monitoring service)
  console.error('Error:', err);

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

