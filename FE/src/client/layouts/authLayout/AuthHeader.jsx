import React from 'react';
import { Link } from 'react-router-dom';
import './AuthHeader.css';

const AuthHeader = () => {
  return (
    <header className="auth-header">
      <div className="auth-header-container">
        <div className="auth-logo">
          <Link to="/" className="auth-logo-link">
            <h1>E-Commerce</h1>
          </Link>
        </div>
        
        <nav className="auth-nav">
          <Link to="/" className="auth-nav-link">
            ← Về trang chủ
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default AuthHeader;