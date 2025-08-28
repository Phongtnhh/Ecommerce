import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Mock data - replace with actual API calls
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeaturedProducts([
        { id: 1, name: 'Sản phẩm 1', price: 299000, image: '/api/placeholder/300/300', rating: 4.5 },
        { id: 2, name: 'Sản phẩm 2', price: 399000, image: '/api/placeholder/300/300', rating: 4.8 },
        { id: 3, name: 'Sản phẩm 3', price: 199000, image: '/api/placeholder/300/300', rating: 4.2 },
        { id: 4, name: 'Sản phẩm 4', price: 499000, image: '/api/placeholder/300/300', rating: 4.7 }
      ]);
      
      setCategories([
        { id: 1, name: 'Điện tử', icon: '📱', count: 150 },
        { id: 2, name: 'Thời trang', icon: '👕', count: 200 },
        { id: 3, name: 'Gia dụng', icon: '🏠', count: 80 },
        { id: 4, name: 'Sách', icon: '📚', count: 120 }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Chào mừng đến với E-Commerce</h1>
              <p className="hero-subtitle">
                Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary">
                  Mua sắm ngay
                </Link>
                <Link to="/about" className="btn btn-outline">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img src="/api/placeholder/500/400" alt="Hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section page-section">
        <div className="container">
          <h2 className="section-title">Danh mục sản phẩm</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link 
                key={category.id} 
                to={`/categories/${category.id}`}
                className="category-card"
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} sản phẩm</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section page-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <Link to="/products" className="view-all-link">
              Xem tất cả →
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button className="quick-view-btn">Xem nhanh</button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <span className="stars">⭐⭐⭐⭐⭐</span>
                    <span className="rating-text">({product.rating})</span>
                  </div>
                  <div className="product-price">
                    {product.price.toLocaleString('vi-VN')}đ
                  </div>
                  <div className="product-actions">
                    <button className="add-to-cart-btn">Thêm vào giỏ</button>
                    <Link to={`/products/${product.id}`} className="view-detail-btn">
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section page-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3>Giao hàng miễn phí</h3>
              <p>Miễn phí giao hàng cho đơn hàng trên 500.000đ</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Thanh toán an toàn</h3>
              <p>Bảo mật thông tin thanh toán 100%</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">↩️</div>
              <h3>Đổi trả dễ dàng</h3>
              <p>Đổi trả trong vòng 30 ngày</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎧</div>
              <h3>Hỗ trợ 24/7</h3>
              <p>Tư vấn và hỗ trợ khách hàng 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
