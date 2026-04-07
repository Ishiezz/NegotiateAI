import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: Error & { code?: number; keyValue?: Record<string, unknown>; errors?: Record<string, { message: string }> },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map((e) => e.message),
    });
    return;
  }

  // MongoDB duplicate key
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    res.status(400).json({ error: `Duplicate value: ${field} already exists` });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Token expired, please login again' });
    return;
  }

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};