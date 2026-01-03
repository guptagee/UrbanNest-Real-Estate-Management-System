const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  toggleFeatured
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

/**
 * Admin Project Routes - ADMIN ONLY
 * Full CRUD operations for project management
 */

// Apply authentication and authorization to all routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAllProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.put('/:id/toggle-status', toggleProjectStatus);
router.put('/:id/toggle-featured', toggleFeatured);

module.exports = router;

