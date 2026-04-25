const generateToken = (id) => {
  return require('jsonwebtoken').sign({ id }, process.env.JWT_SECRET || 'secretkey123', {
    expiresIn: '30d',
  });
};

const analyzeSentiment = (text) => {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'perfect', 'awesome', 'fantastic', 'happy', 'satisfied', 'recommend', 'beautiful', 'nice', 'quality'];
  const negativeWords = ['bad', 'terrible', 'worst', 'hate', 'awful', 'poor', 'disappointed', 'broken', 'defective', 'waste', 'useless', 'cheap', 'horrible'];
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 1;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 1;
  });
  
  if (score > 0) return { sentiment: 'positive', score };
  if (score < 0) return { sentiment: 'negative', score };
  return { sentiment: 'neutral', score: 0 };
};

const getRecommendations = (userHistory, allProducts) => {
  if (!userHistory || userHistory.length === 0) {
    return allProducts.sort(() => 0.5 - Math.random()).slice(0, 8);
  }
  
  const viewedCategories = userHistory.map(h => h.product?.category?.toString()).filter(Boolean);
  const categoryCounts = {};
  viewedCategories.forEach(cat => {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  
  const topCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0];
  
  const recommended = allProducts
    .filter(p => p.category.toString() === topCategory && !viewedCategories.includes(p._id.toString()))
    .slice(0, 8);
    
  if (recommended.length < 8) {
    const remaining = allProducts
      .filter(p => !recommended.includes(p))
      .sort(() => 0.5 - Math.random())
      .slice(0, 8 - recommended.length);
    return [...recommended, ...remaining];
  }
  
  return recommended;
};

module.exports = { generateToken, analyzeSentiment, getRecommendations };

