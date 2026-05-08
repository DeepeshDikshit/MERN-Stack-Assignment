import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a story title'],
      trim: true,
      maxLength: [500, 'Title cannot exceed 500 characters'],
    },
    url: {
      type: String,
      required: [true, 'Please provide a story URL'],
      trim: true,
    },
    points: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative'],
    },
    author: {
      type: String,
      required: [true, 'Please provide author name'],
      trim: true,
    },
    postedAt: {
      type: Date,
      required: [true, 'Please provide posted time'],
    },
    hackerNewsId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values for unique index
      index: true,
    },
    comments: {
      type: Number,
      default: 0,
      min: [0, 'Comments cannot be negative'],
    },
    source: {
      type: String,
      enum: ['hackernews'],
      default: 'hackernews',
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for sorting by points and date
storySchema.index({ points: -1, postedAt: -1 });
storySchema.index({ createdAt: -1 });
storySchema.index({ hackerNewsId: 1 });

const Story = mongoose.model('Story', storySchema);

export default Story;
