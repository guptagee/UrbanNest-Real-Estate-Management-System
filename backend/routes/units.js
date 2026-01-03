const express = require('express');
const router = express.Router();
const {
  getAllUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
  updateAvailabilityStatus,
  bulkUpdateUnits
} = require('../controllers/unitController');
const { protect, authorize } = require('../middleware/auth');

/**
 * Unit Routes
 * Public routes for viewing units
 * Admin routes for unit management
 */

// Public routes
router.get('/', getAllUnits);
router.get('/:id', getUnit);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', createUnit);

router.route('/bulk-update')
  .put(bulkUpdateUnits);

router.route('/:id')
  .put(updateUnit)
  .delete(deleteUnit);

router.put('/:id/availability', updateAvailabilityStatus);

module.exports = router;
