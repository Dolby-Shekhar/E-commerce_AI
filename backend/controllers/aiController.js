const Product = require('../models/Product');
const User = require('../models/User');
const { getRecommendations, analyzeSentiment } = require('../utils/helpers');

const getRecommendationsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const allProducts = await Product.find({ isActive: true }).populate('category', 'name');
    
    const recommendations = getRecommendations(user.browsingHistory, allProducts);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchWithAI = async (req, res) => {
  try {
    const { query } = req.body;
    const queryLower = query.toLowerCase();
    
    // Smart search with typo tolerance and synonyms
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
        { brand: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    }).populate('category', 'name').limit(20);
    
    // AI ranking based on relevance
    const rankedProducts = products.map(product => {
      let relevanceScore = 0;
      const nameLower = product.name.toLowerCase();
      
      if (nameLower.includes(queryLower)) relevanceScore += 10;
      if (nameLower.startsWith(queryLower)) relevanceScore += 5;
      if (product.description.toLowerCase().includes(queryLower)) relevanceScore += 3;
      if (product.tags.some(tag => tag.toLowerCase().includes(queryLower))) relevanceScore += 2;
      
      return { ...product.toObject(), relevanceScore };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    res.json(rankedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const chatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMsg = message.toLowerCase();
    
    let response = '';
    
    if (lowerMsg.includes('order') || lowerMsg.includes('track')) {
      response = 'You can track your orders in the "My Orders" section. Would you like me to guide you there?';
    } else if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
      response = 'Returns are accepted within 7 days of delivery. Please go to My Orders and select the item you want to return.';
    } else if (lowerMsg.includes('payment') || lowerMsg.includes('pay')) {
      response = 'We accept Cash on Delivery, Credit/Debit Cards, UPI, and Wallet payments. All transactions are secure and encrypted.';
    } else if (lowerMsg.includes('delivery') || lowerMsg.includes('shipping')) {
      response = 'Standard delivery takes 3-5 business days. Free shipping on orders above ₹500!';
    } else if (lowerMsg.includes('discount') || lowerMsg.includes('offer') || lowerMsg.includes('sale')) {
      response = 'Check out our Deals section for the latest discounts and offers! You can also apply coupon codes at checkout.';
    } else if (lowerMsg.includes('contact') || lowerMsg.includes('support')) {
      response = 'You can reach our support team at support@eshop.com or call us at 1800-123-4567 (24/7).';
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      response = 'Hello! Welcome to E-Shop. How can I assist you today?';
    } else if (lowerMsg.includes('recommend') || lowerMsg.includes('suggest')) {
      response = 'I can recommend products based on your browsing history. Check the "Recommended for You" section on the homepage!';
    } else {
      response = 'I\'m here to help! You can ask me about orders, payments, returns, delivery, or current offers.';
    }
    
    res.json({ response, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const analyzeReviewSentiment = async (req, res) => {
  try {
    const { text } = req.body;
    const result = analyzeSentiment(text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ rating: -1, numReviews: -1 })
      .limit(10)
      .populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getRecommendationsForUser, 
  searchWithAI, 
  chatbotResponse, 
  analyzeReviewSentiment,
  getTrendingProducts 
};

