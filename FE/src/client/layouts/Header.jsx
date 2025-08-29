import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Mock user state - replace with actual auth state
  const [user, setUser] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, []);

  useEffect(() => {
  console.log("User đã được load:", user);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <h1>Chopeer</h1>
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
                  <span className="user-name">{user.fullName}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="dropdown-menu show">
                    <Link to="/profile" className="dropdown-item">Hồ sơ</Link>
                    <Link to="/orders" className="dropdown-item">Đơn hàng</Link>
                    <button onClick={handleLogout} className="dropdown-item">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
              <button className="auth-button login">Đăng nhập</button>
              <button className="auth-button register">Đăng ký</button>
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
