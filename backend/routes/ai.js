const express = require('express');
const router = express.Router();
const { getRecommendationsForUser, searchWithAI, chatbotResponse, analyzeReviewSentiment, getTrendingProducts } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.get('/recommendations', protect, getRecommendationsForUser);
router.post('/search', searchWithAI);
router.post('/chatbot', chatbotResponse);
router.post('/sentiment', analyzeReviewSentiment);
router.get('/trending', getTrendingProducts);

module.exports = router;

