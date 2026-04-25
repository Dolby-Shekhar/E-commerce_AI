const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWishlist);
router.post('/add', protect, addToWishlist);
router.delete('/:id', protect, removeFromWishlist);
router.delete('/', protect, clearWishlist);

module.exports = router;

