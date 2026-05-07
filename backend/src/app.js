import express from 'express';
import cors from 'cors';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import userRoutes from './routes/userRoutes.js';
import { HTTP_STATUS, API_MESSAGES } from './config/constants.js';

const app = express();

// ==================== MIDDLEWARE ====================

// Request logging
app.use(logger);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/users', userRoutes);

// ==================== ERROR HANDLING ====================

// 404 Not Found handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND));
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
