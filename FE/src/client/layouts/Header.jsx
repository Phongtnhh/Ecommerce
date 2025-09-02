import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBox from '../components/Search/SearchBox';
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
      setCartItemsCount(parseInt(localStorage.getItem('countCart')) || 0);
    }

    // Listen for cart updates
    const handleCartUpdate = (event) => {
      setCartItemsCount(event.detail.count);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('countCart');
    setCartItemsCount(0); 
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
            <li><Link to="/about" className="nav-link">Giới thiệu</Link></li>
            <li><Link to="/contact" className="nav-link">Liên hệ</Link></li>
          </ul>
        </nav>

        {/* Search Bar */}
        <SearchBox className="header-search" />

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
              <Link to ="/auth/login" className="auth-button login">Đăng nhập</Link>
              <Link to ="/auth/register" className="auth-button register">Đăng ký</Link>
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
