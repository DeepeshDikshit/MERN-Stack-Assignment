import User from '../models/User.js';
import { catchAsyncErrors, AppError } from '../middleware/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';

// @desc    Add bookmark
// @route   POST /api/users/bookmarks/:postId
// @access  Private
export const addBookmark = catchAsyncErrors(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.userId;

  if (!postId) {
    return next(
      new AppError('Please provide a post ID', HTTP_STATUS.BAD_REQUEST)
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { bookmarks: postId } }, // $addToSet prevents duplicates
    { new: true, runValidators: true }
  ).populate('bookmarks');

  if (!user) {
    return next(new AppError('User not found', HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Post bookmarked successfully',
    data: user.bookmarks,
  });
});

// @desc    Remove bookmark
// @route   DELETE /api/users/bookmarks/:postId
// @access  Private
export const removeBookmark = catchAsyncErrors(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.userId;

  if (!postId) {
    return next(
      new AppError('Please provide a post ID', HTTP_STATUS.BAD_REQUEST)
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { bookmarks: postId } },
    { new: true, runValidators: true }
  ).populate('bookmarks');

  if (!user) {
    return next(new AppError('User not found', HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Bookmark removed successfully',
    data: user.bookmarks,
  });
});

// @desc    Get all bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
export const getBookmarks = catchAsyncErrors(async (req, res, next) => {
  const userId = req.userId;

  const user = await User.findById(userId).populate('bookmarks');

  if (!user) {
    return next(new AppError('User not found', HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: user.bookmarks.length,
    data: user.bookmarks,
  });
});

// @desc    Check if post is bookmarked
// @route   GET /api/users/bookmarks/check/:postId
// @access  Private
export const isBookmarked = catchAsyncErrors(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.userId;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User not found', HTTP_STATUS.NOT_FOUND));
  }

  const bookmarked = user.bookmarks.includes(postId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    bookmarked,
  });
});
