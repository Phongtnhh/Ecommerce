import React from 'react';
import { Link } from 'react-router-dom';
import './AuthFooter.css';

const AuthFooter = () => {
  return (
    <footer className="auth-footer">
      <div className="auth-footer-container">
        <div className="auth-footer-content">
          <div className="auth-footer-links">
            <Link to="/privacy" className="auth-footer-link">
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="auth-footer-link">
              Điều khoản sử dụng
            </Link>
            <Link to="/contact" className="auth-footer-link">
              Liên hệ
            </Link>
          </div>
          
          <div className="auth-footer-copyright">
            <p>&copy; 2024 E-Commerce. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;