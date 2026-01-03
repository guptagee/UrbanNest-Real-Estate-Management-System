const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePreferences,
  addToSearchHistory,
  getMyProperties,
  toggleFavorite,
  getFavorites
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/preferences', protect, updatePreferences);
router.post('/search-history', protect, addToSearchHistory);
router.get('/my-properties', protect, getMyProperties);
router.post('/favorites', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router;

