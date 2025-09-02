import React, { useState, useEffect } from 'react';
import {CategoryService} from '../../services/categoryService';
import {ProductService} from '../../services/productService';
import { Link } from 'react-router-dom';
import './Home.css';


const Home = () => {
  // Mock data - replace with actual API calls
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await CategoryService.getCategory();
        const product = await ProductService.getProducts();
        setCategories(res.data.Category);
        setFeaturedProducts(product.data.newProducts);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy categories:", error);
      }
    };
    fetchHome();
  },[]);

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

      {/* Danh mục */}
      <section className="categories-section page-section">
        <div className="container">
          <h2 className="section-title">Danh mục sản phẩm</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link
                key={category._id}
                to={`/products/${category.slug}`}
                className="category-card"
              >

                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.title}</h3>
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
          {/* Grid sản phẩm */}
          <div className="product-grid">
            {featuredProducts.map(product => (
              <Link to={`/products/detail/${product.slug}`} className="product-card" key={product._id}>
                <div className="discount-tag">-5%</div>
                <img 
                  src={product.thumbnail || "/default.jpg"} 
                  alt={product.name} 
                  className="product-image" 
                />
                <div className="product-info">
                  <div className="product-title">{product.title}</div>
                  <div className="product-price">{product.price.toLocaleString()}đ</div>
                  <div className="product-sold">Đã bán {product.soldCount || "20+"}</div>
                </div>
              </Link>
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
