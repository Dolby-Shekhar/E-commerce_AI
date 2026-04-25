import React, { useState, useEffect } from 'react';
import { productAPI, orderAPI } from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    brand: '',
    category: '',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    features: [],
    discount: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        productAPI.getProducts({}),
        orderAPI.getAllOrders()
      ]);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data);
      calculateStats(productsRes.data.products, ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateStats = (products, orders) => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stock: Number(formData.stock),
        discount: Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100) || 0
      };

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, data);
        alert('Product updated successfully');
      } else {
        await productAPI.createProduct(data);
        alert('Product created successfully');
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.deleteProduct(id);
      fetchData();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      brand: product.brand,
      category: product.category?._id || '',
      images: product.images,
      features: product.features,
      discount: product.discount
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '',
      brand: '',
      category: '',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
      features: [],
      discount: 0
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { status: newStatus });
      fetchData();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card card">
            <i className="fas fa-box"></i>
            <div>
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
          <div className="stat-card card">
            <i className="fas fa-shopping-bag"></i>
            <div>
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card card">
            <i className="fas fa-rupee-sign"></i>
            <div>
              <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            <i className="fas fa-box"></i> Products
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fas fa-shopping-cart"></i> Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="section-actions">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setEditingProduct(null);
                  resetForm();
                  setShowForm(!showForm);
                }}
              >
                <i className="fas fa-plus"></i> Add Product
              </button>
            </div>

            {showForm && (
              <div className="product-form card">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Brand</label>
                      <input 
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      rows="3"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Original Price (₹)</label>
                      <input 
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock</label>
                      <input 
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {editingProduct ? 'Update' : 'Create'} Product
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td><img src={product.images[0]} alt={product.name} width="50" onError={(e) => { e.target.src = 'https://placehold.co/400x400/2874f0/ffffff?text=Product'; }} /></td>
                      <td>{product.name}</td>
                      <td>₹{product.price.toLocaleString()}</td>
                      <td>{product.stock}</td>
                      <td className="actions">
                        <button onClick={() => handleEdit(product)} className="btn-edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="btn-delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-section">
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8)}</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>{order.orderItems.length} items</td>
                      <td>₹{order.totalPrice.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

