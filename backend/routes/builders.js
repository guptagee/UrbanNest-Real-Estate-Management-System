const express = require('express');
const router = express.Router();
const {
  getAllBuilders,
  getBuilder,
  createBuilder,
  updateBuilder,
  deleteBuilder,
  toggleBuilderStatus
} = require('../controllers/builderController');
const { protect, authorize } = require('../middleware/auth');

/**
 * Builder Routes
 * Public routes for viewing builders
 * Admin routes for builder management
 */

// Public routes
router.get('/', getAllBuilders);
router.get('/:id', getBuilder);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', createBuilder);
router.route('/:id')
  .put(updateBuilder)
  .delete(deleteBuilder);

router.put('/:id/toggle-status', toggleBuilderStatus);

module.exports = router;
