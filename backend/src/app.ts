import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import rfqRoutes from './routes/rfq.routes';
import { errorHandler, notFound } from './middleware/error.middleware';

const app = express();

if (process.env.NODE_ENV !== 'test') {
  void connectDB();
}

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint — used by load balancers and uptime monitors
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/rfq', rfqRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 RawMart API running on port ${PORT}`);
  });
}

export default app;