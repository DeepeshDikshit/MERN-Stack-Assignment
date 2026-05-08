import express from 'express';
import cors from 'cors';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { protect } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import { HTTP_STATUS } from './config/constants.js';

const app = express();

// ==================== MIDDLEWARE ====================

// Request logging
app.use(logger);

// CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

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
app.use('/api/auth', authRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/stories', storyRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res, next) => {
  next(
    new AppError(
      `Route ${req.originalUrl} not found`,
      HTTP_STATUS.NOT_FOUND
    )
  );
});

// Global error handler
app.use(errorHandler);

export default app;