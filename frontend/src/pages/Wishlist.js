import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product._id, 1);
    removeFromWishlist(product._id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page empty">
        <div className="container">
          <div className="empty-state">
            <i className="far fa-heart"></i>
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you love to your wishlist and revisit them anytime.</p>
            <Link to="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1><i className="fas fa-heart"></i> My Wishlist ({wishlist.length})</h1>
        
        <div className="wishlist-grid">
          {wishlist.map(product => (
            <div key={product._id} className="wishlist-card">
              <div className="wishlist-image">
              <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x400/2874f0/ffffff?text=Product'} 
                  alt={product.name || 'Product'} 
                  onError={(e) => { e.target.src = 'https://placehold.co/400x400/2874f0/ffffff?text=Product'; }}
                />
                <button 
                  className="remove-btn"
                  onClick={() => removeFromWishlist(product._id)}
                  title="Remove from wishlist"
                >
                  <i className="fas fa-times"></i>
                </button>
                {product.discount > 0 && (
                  <span className="discount-badge">-{product.discount}%</span>
                )}
              </div>
              
              <div className="wishlist-details">
                <h3>{product.name}</h3>
                <p className="brand">{product.brand}</p>
                
                <div className="price">
                  <span className="current">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="original">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                
                <div className="rating">
                  <span className="stars">
                    {'★'.repeat(Math.floor(product.rating))}
                    {'☆'.repeat(5 - Math.floor(product.rating))}
                  </span>
                  <span>({product.numReviews})</span>
                </div>
                
                <div className="actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleMoveToCart(product)}
                  >
                    <i className="fas fa-shopping-cart"></i> Move to Cart
                  </button>
                  <Link to={`/product/${product._id}`} className="btn btn-outline btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

