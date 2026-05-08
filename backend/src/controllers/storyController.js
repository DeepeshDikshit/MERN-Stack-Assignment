import Story from '../models/Story.js';
import { catchAsyncErrors, AppError } from '../middleware/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';
import { runScraper } from '../services/scraperService.js';

// @desc    Get all stories with pagination
// @route   GET /api/stories
// @access  Public
export const getStories = catchAsyncErrors(async (req, res, next) => {
  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Validate pagination
  if (page < 1 || limit < 1) {
    return next(
      new AppError('Page and limit must be greater than 0', HTTP_STATUS.BAD_REQUEST)
    );
  }

  const skip = (page - 1) * limit;

  // Get total count for pagination metadata
  const total = await Story.countDocuments();

  // Get paginated stories sorted by points descending
  const stories = await Story.find()
    .sort({ points: -1, postedAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: stories.length,
    pagination: {
      currentPage: page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    data: stories,
  });
});

// @desc    Get story by ID
// @route   GET /api/stories/:id
// @access  Public
export const getStoryById = catchAsyncErrors(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(
      new AppError('Story not found', HTTP_STATUS.NOT_FOUND)
    );
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: story,
  });
});

// @desc    Trigger scraper to fetch and save latest stories
// @route   POST /api/scrape
// @access  Public (can be protected with admin role in production)
export const triggerScraper = catchAsyncErrors(async (req, res, next) => {
  try {
    const result = await runScraper();

    if (!result.success) {
      return next(
        new AppError(result.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
      );
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: result.message,
      storiesScraped: result.storiesScraped,
      storiesCreated: result.created,
      storiesUpdated: result.updated,
    });
  } catch (error) {
    return next(
      new AppError(
        'Failed to run scraper',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Public (should be admin-only in production)
export const deleteStory = catchAsyncErrors(async (req, res, next) => {
  const story = await Story.findByIdAndDelete(req.params.id);

  if (!story) {
    return next(
      new AppError('Story not found', HTTP_STATUS.NOT_FOUND)
    );
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Story deleted successfully',
  });
});

// @desc    Get story statistics
// @route   GET /api/stories/stats
// @access  Public
export const getStoryStats = catchAsyncErrors(async (req, res, next) => {
  const total = await Story.countDocuments();
  
  const stats = await Story.aggregate([
    {
      $group: {
        _id: null,
        totalStories: { $sum: 1 },
        avgPoints: { $avg: '$points' },
        maxPoints: { $max: '$points' },
        minPoints: { $min: '$points' },
        totalComments: { $sum: '$comments' },
      },
    },
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: stats[0] || {
      totalStories: 0,
      avgPoints: 0,
      maxPoints: 0,
      minPoints: 0,
      totalComments: 0,
    },
  });
});
