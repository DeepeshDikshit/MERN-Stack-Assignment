import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import { catchAsyncErrors, AppError } from '../middleware/errorHandler.js';
import { HTTP_STATUS, API_MESSAGES } from '../config/constants.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    return next(
      new AppError(
        'Please provide all required fields',
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }

  // Validate password match
  if (password !== confirmPassword) {
    return next(
      new AppError('Passwords do not match', HTTP_STATUS.BAD_REQUEST)
    );
  }

  // Validate password strength
  if (password.length < 6) {
    return next(
      new AppError(
        'Password must be at least 6 characters',
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new AppError(
        'Email already registered. Please login instead.',
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  // Generate token
  const token = generateToken(user._id);

  // Return user (without password) and token
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bookmarks: user.bookmarks,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(
      new AppError(
        'Please provide email and password',
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }

  // Check for user and get password field (since select: false)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(
      new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED)
    );
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(
      new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED)
    );
  }

  // Check if user is active
  if (!user.isActive) {
    return next(
      new AppError(
        'Your account has been deactivated',
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bookmarks: user.bookmarks,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return next(new AppError('User not found', HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: user,
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = catchAsyncErrors(async (req, res) => {
  // Client-side should remove token from localStorage
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(
      new AppError(
        'Please provide all password fields',
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }

  if (newPassword !== confirmNewPassword) {
    return next(
      new AppError('New passwords do not match', HTTP_STATUS.BAD_REQUEST)
    );
  }

  // Get user with password field
  const user = await User.findById(req.userId).select('+password');

  // Verify current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordCorrect) {
    return next(
      new AppError('Current password is incorrect', HTTP_STATUS.UNAUTHORIZED)
    );
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = generateToken(user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Password updated successfully',
    token,
  });
});
