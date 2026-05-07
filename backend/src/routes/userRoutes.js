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

// User routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Bookmark routes (protected by auth middleware in app.js)
router.post('/bookmarks/:postId', addBookmark);
router.delete('/bookmarks/:postId', removeBookmark);
router.get('/bookmarks', getBookmarks);
router.get('/bookmarks/check/:postId', isBookmarked);

export default router;
