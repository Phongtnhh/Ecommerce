import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Mock user state - replace with actual auth state
  const [user, setUser] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <h1>E-Commerce</h1>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">Trang chủ</Link></li>
            <li><Link to="/products" className="nav-link">Sản phẩm</Link></li>
            <li><Link to="/categories" className="nav-link">Danh mục</Link></li>
            <li><Link to="/about" className="nav-link">Giới thiệu</Link></li>
            <li><Link to="/contact" className="nav-link">Liên hệ</Link></li>
          </ul>
        </nav>

        {/* Search Bar */}
        <div className="header-search">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="search-input"
          />
          <button className="search-btn">
            <i className="search-icon">🔍</i>
          </button>
        </div>

        {/* User Actions */}
        <div className="header-actions">
          {/* Cart */}
          <Link to="/cart" className="cart-link">
            <div className="cart-icon">
              🛒
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </div>
          </Link>

          {/* User Menu */}
          <div className="user-menu">
            {user ? (
              <div className="user-dropdown">
                <button 
                  className="user-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user.name}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">Hồ sơ</Link>
                    <Link to="/orders" className="dropdown-item">Đơn hàng</Link>
                    <Link to="/wishlist" className="dropdown-item">Yêu thích</Link>
                    <button onClick={handleLogout} className="dropdown-item">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn login-btn">Đăng nhập</Link>
                <Link to="/register" className="auth-btn register-btn">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
