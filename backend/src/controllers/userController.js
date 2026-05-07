import User from '../models/User.js';
import { catchAsyncErrors, AppError } from '../middleware/errorHandler.js';
import { HTTP_STATUS, API_MESSAGES } from '../config/constants.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = catchAsyncErrors(async (req, res) => {
  const users = await User.find().select('-password');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError(API_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: user,
  });
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
export const createUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return next(
      new AppError(API_MESSAGES.INVALID_REQUEST, HTTP_STATUS.BAD_REQUEST)
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new AppError('User with this email already exists', HTTP_STATUS.BAD_REQUEST)
    );
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError(API_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND));
  }

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError(API_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'User deleted successfully',
    data: user,
  });
});
