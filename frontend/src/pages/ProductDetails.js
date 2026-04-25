import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, aiAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', title: '' });
  const [addingToCart, setAddingToCart] = useState(false);
  const [sentiment, setSentiment] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getProduct(id);
      setProduct(res.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    const success = await addToCart(id, quantity);
    if (success) {
      alert('Added to cart!');
    }
    setAddingToCart(false);
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    await toggleWishlist(id);
    setWishlistLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await productAPI.createReview(id, reviewForm);
      fetchProduct();
      setReviewForm({ rating: 5, comment: '', title: '' });
      setSentiment(null);
      alert('Review submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const analyzeReview = async () => {
    if (!reviewForm.comment) return;
    try {
      const res = await aiAPI.analyzeSentiment({ text: reviewForm.comment });
      setSentiment(res.data);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="container">Product not found</div>;
  }

  const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const inWishlist = isInWishlist(id);

  return (
    <div className="product-details">
      <div className="container">
        <div className="product-details-grid">
          {/* Product Image */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[0]} alt={product.name} onError={(e) => { e.target.src = 'https://placehold.co/400x400/2874f0/ffffff?text=Product'; }} />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-details">
            <h1>{product.name}</h1>
            <p className="brand">Brand: {product.brand}</p>
            
            <div className="rating-summary">
              <span className="rating-badge">
                {product.rating.toFixed(1)} <i className="fas fa-star"></i>
              </span>
              <span className="reviews-count">{product.numReviews} Reviews</span>
            </div>

            <div className="price-section">
              <span className="current-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="discount">{discount}% off</span>
                </>
              )}
            </div>

            <p className="description">{product.description}</p>

            {product.features?.length > 0 && (
              <div className="features">
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}><i className="fas fa-check"></i> {feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="specifications">
                <h3>Specifications</h3>
                <table>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock"><i className="fas fa-check-circle"></i> In Stock ({product.stock} left)</span>
              ) : (
                <span className="out-of-stock"><i className="fas fa-times-circle"></i> Out of Stock</span>
              )}
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-accent btn-lg"
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
              >
                <i className="fas fa-shopping-cart"></i>
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="btn btn-secondary btn-lg">
                <i className="fas fa-bolt"></i> Buy Now
              </button>
              <button 
                className={`btn btn-lg wishlist-action-btn ${inWishlist ? 'active' : ''}`}
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <i className={`${inWishlist ? 'fas' : 'far'} fa-heart`}></i>
                {wishlistLoading ? '...' : (inWishlist ? 'In Wishlist' : 'Wishlist')}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          
          {/* Review Form */}
          {user && (
            <div className="review-form card">
              <h3>Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Rating</label>
                  <select 
                    value={reviewForm.rating} 
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} Stars</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Review title"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Review</label>
                  <textarea
                    rows="4"
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    onBlur={analyzeReview}
                    required
                  ></textarea>
                  {sentiment && (
                    <div className={`sentiment-badge ${sentiment.sentiment}`}>
                      Sentiment: {sentiment.sentiment} (Score: {sentiment.score})
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="reviews-list">
            {product.reviews?.length > 0 ? (
              product.reviews.map(review => (
                <div key={review._id} className="review-card card">
                  <div className="review-header">
                    <div className="reviewer">
                      <div className="avatar">{review.user?.name?.[0] || 'U'}</div>
                      <span>{review.user?.name || 'Anonymous'}</span>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < review.rating ? 'active' : ''}`}></i>
                    ))}
                    {review.sentiment && (
                      <span className={`sentiment-tag ${review.sentiment}`}>
                        {review.sentiment}
                      </span>
                    )}
                  </div>
                  <h4>{review.title}</h4>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

