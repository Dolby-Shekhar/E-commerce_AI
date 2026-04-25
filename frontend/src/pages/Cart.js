import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Cart.css';

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="cart-page container">
        <div className="auth-required">
          <i className="fas fa-shopping-cart"></i>
          <h2>Please Login</h2>
          <p>You need to be logged in to view your cart</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page container">
        <div className="empty-cart">
          <i className="fas fa-shopping-basket"></i>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything yet</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 500 ? 0 : 40;
  const tax = Math.round(cartTotal * 0.18 * 100) / 100;
  const total = cartTotal + shipping + tax;

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        
        <div className="cart-grid">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item card">
                <div className="item-image">
                  <img src={item.product?.images?.[0]} alt={item.product?.name} onError={(e) => { e.target.src = 'https://placehold.co/400x400/2874f0/ffffff?text=Product'; }} />
                </div>
                
                <div className="item-details">
                  <Link to={`/product/${item.product?._id}`}>
                    <h3>{item.product?.name}</h3>
                  </Link>
                  <p className="item-brand">{item.product?.brand}</p>
                  <div className="item-price">₹{item.price?.toLocaleString()}</div>
                </div>
                
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}>+</button>
                  </div>
                  
                  <button 
                    className="btn-remove"
                    onClick={() => removeFromCart(item.product?._id)}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
                
                <div className="item-total">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (18% GST)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            
            {shipping > 0 && cartTotal < 500 && (
              <div className="shipping-info">
                Add items worth ₹{(500 - cartTotal).toLocaleString()} more for FREE shipping
              </div>
            )}
            
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            
            <button 
              className="btn btn-accent btn-block"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            
            <Link to="/" className="continue-shopping">
              <i className="fas fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

