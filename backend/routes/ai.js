const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// /api/ai/chat
router.post('/chat', aiController.chatWithAI);

// /api/ai/description
router.post('/description', aiController.generatePropertyDescription);

// /api/ai/recommend
router.post('/recommend', aiController.recommendProperties);

// /api/ai/seed-properties (for testing purposes)
router.post('/seed-properties', aiController.seedTestProperties);

module.exports = router;

