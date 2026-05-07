import { verifyToken } from '../config/jwt.js';
import { AppError } from './errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';

// Protect routes - verify JWT token
export const protect = (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(
        new AppError('Not authorized to access this route', HTTP_STATUS.UNAUTHORIZED)
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return next(
      new AppError('Not authorized to access this route', HTTP_STATUS.UNAUTHORIZED)
    );
  }
};

// Restrict to specific roles
export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const User = (await import('../models/User.js')).default;
      const user = await User.findById(req.userId);

      if (!user) {
        return next(
          new AppError('User not found', HTTP_STATUS.NOT_FOUND)
        );
      }

      if (!roles.includes(user.role)) {
        return next(
          new AppError(
            'Not authorized to access this route',
            HTTP_STATUS.FORBIDDEN
          )
        );
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
