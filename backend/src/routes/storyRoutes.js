import express from 'express';
import {
  getStories,
  getStoryById,
  triggerScraper,
  deleteStory,
  getStoryStats,
} from '../controllers/storyController.js';

const router = express.Router();

// Specific routes FIRST (to avoid param matching)
router.post('/scrape', triggerScraper);
router.get('/stats', getStoryStats);

// General routes AFTER
router.get('/', getStories);
router.get('/:id', getStoryById);
router.delete('/:id', deleteStory);

export default router;
