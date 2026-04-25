import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI, aiAPI } from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const keyword = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
    fetchTrending();
    fetchRecommendations();
  }, [keyword, page, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        keyword: keyword || undefined,
        sort: sort || undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined
      };
      const res = await productAPI.getProducts(params);
      setProducts(res.data.products);
      setPages(res.data.pages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await aiAPI.getTrending();
      setTrending(res.data);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await aiAPI.getRecommendations();
        setRecommendations(res.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="home">
      {/* Hero Banner */}
      {!keyword && (
        <div className="hero-banner">
          <div className="hero-content">
            <h1>Smart Shopping with AI</h1>
            <p>Discover products tailored just for you with our AI-powered recommendations</p>
            <button className="btn btn-primary" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
              Shop Now
            </button>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && !keyword && (
        <div className="section recommendations">
          <div className="container">
            <div className="section-header">
              <h2><i className="fas fa-magic"></i> Recommended For You</h2>
              <p>Based on your browsing history</p>
            </div>
            <div className="products-grid">
              {recommendations.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trending Products */}
      {trending.length > 0 && !keyword && (
        <div className="section trending">
          <div className="container">
            <div className="section-header">
              <h2><i className="fas fa-fire"></i> Trending Now</h2>
            </div>
            <div className="products-grid">
              {trending.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Products */}
      <div id="products" className="section products-section">
        <div className="container">
          <div className="section-header">
            <h2>{keyword ? `Search Results: "${keyword}"` : 'All Products'}</h2>
            <div className="filters">
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="">Sort By</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <form onSubmit={handlePriceFilter} className="price-filter">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
                <button type="submit" className="btn btn-primary">Filter</button>
              </form>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="pagination">
                  {[...Array(pages).keys()].map(x => (
                    <button
                      key={x + 1}
                      className={page === x + 1 ? 'active' : ''}
                      onClick={() => setPage(x + 1)}
                    >
                      {x + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

