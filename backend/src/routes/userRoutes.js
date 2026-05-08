import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked,
} from '../controllers/bookmarkController.js';

const router = express.Router();

// Bookmark routes FIRST (specific routes before parameterized ones)
router.get('/bookmarks', getBookmarks);
router.get('/bookmarks/check/:postId', isBookmarked);
router.post('/bookmarks/:postId', addBookmark);
router.delete('/bookmarks/:postId', removeBookmark);

// User routes (parameterized routes last)
router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
