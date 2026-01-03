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
 * Project Routes
 * Public routes for viewing projects (read-only for all authenticated users)
 * Admin routes for project management (ADMIN ONLY)
 */

// Public routes - Read-only access for all users (no auth required)
router.get('/', getAllProjects);
router.get('/:id', getProject);

// Admin-only routes - Full CRUD operations
// Note: Admin routes are mounted at /api/admin/projects in server.js
module.exports = router;

