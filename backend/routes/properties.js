const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getRecommendations,
  togglePropertyAvailability,
  getPropertyAnalytics,
  getAgentPropertyStats
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProperties);
router.get('/recommendations', protect, getRecommendations);
router.get('/agent/stats', protect, authorize('agent', 'admin'), getAgentPropertyStats);
router.get('/:id', getProperty);
router.get('/:id/analytics', protect, getPropertyAnalytics);
router.post('/', protect, authorize('agent'), createProperty);
router.put('/:id', protect, updateProperty);
router.put('/:id/availability', protect, togglePropertyAvailability);
router.delete('/:id', protect, deleteProperty);

module.exports = router;

