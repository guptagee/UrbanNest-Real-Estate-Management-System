const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// /api/ai/chat
router.post('/chat', aiController.chatWithAI);

// /api/ai/description
router.post('/description', aiController.generatePropertyDescription);

// /api/ai/recommend
router.post('/recommend', aiController.recommendProperties);

module.exports = router;

