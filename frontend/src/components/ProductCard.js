import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const inWishlist = isInWishlist(product._id);
  const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };
  
  return (
    <div className="product-card card">
      <Link to={`/product/${product._id}`}>
        <div className="product-image">
          <img 
            src={product.images[0] || 'https://placehold.co/400x400/2874f0/ffffff?text=Product'} 
            alt={product.name} 
            loading="lazy" 
            onError={(e) => { e.target.src = 'https://placehold.co/400x400/2874f0/ffffff?text=Product'; }}
          />
          {discount > 0 && (
            <span className="discount-badge">-{discount}%</span>
          )}
          <button 
            className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlistClick}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <i className={`${inWishlist ? 'fas' : 'far'} fa-heart`}></i>
          </button>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-brand">{product.brand}</p>
          
          <div className="product-rating">
            <span className="rating-badge">
              {product.rating} <i className="fas fa-star"></i>
            </span>
            <span className="rating-count">({product.numReviews})</span>
          </div>
          
          <div className="product-price">
            <span className="current-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

