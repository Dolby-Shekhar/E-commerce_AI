import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import '../styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod'
  });

  const shipping = cartTotal > 500 ? 0 : 40;
  const tax = Math.round(cartTotal * 0.18 * 100) / 100;
  const total = cartTotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await orderAPI.createOrder({
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod
      });
      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page container">
        <div className="empty-checkout">
          <i className="fas fa-shopping-bag"></i>
          <h2>Your cart is empty</h2>
          <p>Add items to your cart before checkout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <div className="checkout-form">
            <div className="card">
              <h2>Shipping Address</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter street address"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>

                <h2 className="payment-title">Payment Method</h2>
                <div className="payment-methods">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', icon: 'fa-money-bill-wave' },
                    { id: 'card', label: 'Credit/Debit Card', icon: 'fa-credit-card' },
                    { id: 'upi', label: 'UPI', icon: 'fa-mobile-alt' },
                    { id: 'wallet', label: 'Wallet', icon: 'fa-wallet' }
                  ].map(method => (
                    <label key={method.id} className={`payment-option ${formData.paymentMethod === method.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      />
                      <i className={`fas ${method.icon}`}></i>
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>

                <button type="submit" className="btn btn-accent btn-block" disabled={loading}>
                  {loading ? 'Processing...' : `Place Order - ₹${total.toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>

          <div className="order-summary">
            <div className="card">
              <h2>Order Summary</h2>
              
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item._id} className="order-item">
                    <img src={item.product?.images?.[0]} alt={item.product?.name} onError={(e) => { e.target.src = 'https://placehold.co/400x400/2874f0/ffffff?text=Product'; }} />
                    <div className="order-item-details">
                      <p>{item.product?.name}</p>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

