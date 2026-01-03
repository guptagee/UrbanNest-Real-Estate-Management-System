const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllProperties,
  updatePropertyStatus,
  deleteProperty,
  getAllBookings,
  updateBookingStatus,
  getAllReports,
  updateReportStatus,
  getAllInquiries,
  updateInquiryStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Statistics
router.get('/stats', getStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Property Management
router.get('/properties', getAllProperties);
router.put('/properties/:id/status', updatePropertyStatus);
router.delete('/properties/:id', deleteProperty);

// Booking Management
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Inquiry Management
router.get('/inquiries', getAllInquiries);
router.put('/inquiries/:id', updateInquiryStatus);

// Report Management
router.get('/reports', getAllReports);
router.put('/reports/:id', updateReportStatus);

module.exports = router;

