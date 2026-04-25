const Product = require('../models/Product');
const Review = require('../models/Review');
const { analyzeSentiment } = require('../utils/helpers');

const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword ? {
      $or: [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.keyword, 'i')] } }
      ]
    } : {};
    
    const categoryFilter = req.query.category ? { category: req.query.category } : {};
    const priceFilter = req.query.minPrice || req.query.maxPrice ? {
      price: {
        ...(req.query.minPrice && { $gte: Number(req.query.minPrice) }),
        ...(req.query.maxPrice && { $lte: Number(req.query.maxPrice) })
      }
    } : {};
    
    const sortOption = {};
    if (req.query.sort === 'price_asc') sortOption.price = 1;
    else if (req.query.sort === 'price_desc') sortOption.price = -1;
    else if (req.query.sort === 'rating') sortOption.rating = -1;
    else sortOption.createdAt = -1;
    
    const count = await Product.countDocuments({ ...keyword, ...categoryFilter, ...priceFilter, isActive: true });
    const products = await Product.find({ ...keyword, ...categoryFilter, ...priceFilter, isActive: true })
      .populate('category', 'name')
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
      
    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' }
      });
      
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      seller: req.user._id
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: req.params.id });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    
    const sentimentData = analyzeSentiment(comment);
    
    const review = new Review({
      user: req.user._id,
      product: req.params.id,
      rating: Number(rating),
      comment,
      title,
      sentiment: sentimentData.sentiment,
      sentimentScore: sentimentData.score
    });
    
    await review.save();
    
    product.reviews.push(review._id);
    product.numReviews = product.reviews.length;
    
    const allReviews = await Review.find({ product: req.params.id });
    product.rating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
    
    await product.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview };

