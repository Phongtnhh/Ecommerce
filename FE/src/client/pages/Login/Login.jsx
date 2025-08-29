import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginService } from '../../services/login';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await LoginService.login(formData);
      console.log(response.data);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (error) {
      setErrors({ general: 'Đăng nhập thất bại. Vui lòng thử lại.' + error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Đăng nhập</h1>
            <p>Chào mừng bạn quay trở lại!</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {errors.general && (
              <div className="error-alert">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="Nhập email của bạn"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'error' : ''}`}
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>hoặc</span>
          </div>

          <div className="social-login">
            <button className="social-btn google-btn">
              <span className="social-icon">🔍</span>
              Đăng nhập với Google
            </button>
            <button className="social-btn facebook-btn">
              <span className="social-icon">📘</span>
              Đăng nhập với Facebook
            </button>
          </div>

          <div className="login-footer">
            <p>
              Chưa có tài khoản? 
              <Link to="/auth/register" className="register-link">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        <div className="login-image">
          <img src="/api/placeholder/500/600" alt="Login" />
          <div className="image-overlay">
            <h2>Khám phá thế giới mua sắm</h2>
            <p>Hàng ngàn sản phẩm chất lượng đang chờ bạn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
