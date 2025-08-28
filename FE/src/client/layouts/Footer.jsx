import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h3 className="footer-title">E-Commerce</h3>
          <p className="footer-description">
            Cửa hàng trực tuyến hàng đầu với các sản phẩm chất lượng cao 
            và dịch vụ khách hàng tuyệt vời.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">📷</a>
            <a href="#" className="social-link">🐦</a>
            <a href="#" className="social-link">📺</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Liên kết nhanh</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Trang chủ</Link></li>
            <li><Link to="/products" className="footer-link">Sản phẩm</Link></li>
            <li><Link to="/categories" className="footer-link">Danh mục</Link></li>
            <li><Link to="/about" className="footer-link">Giới thiệu</Link></li>
            <li><Link to="/contact" className="footer-link">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Hỗ trợ khách hàng</h4>
          <ul className="footer-links">
            <li><Link to="/help" className="footer-link">Trung tâm trợ giúp</Link></li>
            <li><Link to="/shipping" className="footer-link">Chính sách giao hàng</Link></li>
            <li><Link to="/returns" className="footer-link">Đổi trả hàng</Link></li>
            <li><Link to="/warranty" className="footer-link">Bảo hành</Link></li>
            <li><Link to="/faq" className="footer-link">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Tài khoản</h4>
          <ul className="footer-links">
            <li><Link to="/login" className="footer-link">Đăng nhập</Link></li>
            <li><Link to="/register" className="footer-link">Đăng ký</Link></li>
            <li><Link to="/profile" className="footer-link">Hồ sơ cá nhân</Link></li>
            <li><Link to="/orders" className="footer-link">Đơn hàng của tôi</Link></li>
            <li><Link to="/wishlist" className="footer-link">Danh sách yêu thích</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Thông tin liên hệ</h4>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+84 123 456 789</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span>info@ecommerce.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🕒</span>
              <span>8:00 - 22:00 (Thứ 2 - CN)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="newsletter-section">
        <div className="newsletter-container">
          <h4>Đăng ký nhận tin tức</h4>
          <p>Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt</p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Nhập email của bạn..." 
              className="newsletter-input"
            />
            <button className="newsletter-btn">Đăng ký</button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="copyright">
            <p>&copy; 2024 E-Commerce. Tất cả quyền được bảo lưu.</p>
          </div>
          <div className="footer-bottom-links">
            <Link to="/privacy" className="bottom-link">Chính sách bảo mật</Link>
            <Link to="/terms" className="bottom-link">Điều khoản sử dụng</Link>
            <Link to="/cookies" className="bottom-link">Chính sách Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
