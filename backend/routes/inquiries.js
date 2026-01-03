const express = require('express');
const router = express.Router();
const {
    createInquiry,
    getInquiries,
    getInquiry,
    updateInquiry,
    deleteInquiry,
    getInquiryStats
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('agent', 'admin'), getInquiryStats);
router.get('/', protect, getInquiries);
router.get('/:id', protect, getInquiry);
router.post('/', protect, createInquiry);
router.put('/:id', protect, authorize('agent', 'admin'), updateInquiry);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;
