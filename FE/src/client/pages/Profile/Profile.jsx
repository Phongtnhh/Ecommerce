import React, { useState, useEffect } from 'react';
import { authService, apiService } from '../../../shared/services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const userData = authService.getUser();
    if (userData) {
      setUser(userData);
      setFormData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setAvatarPreview(userData.image_avatar || '');
    }
  }, []);

  const handleInputChange = (e) => {
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setErrors(prev => ({
          ...prev,
          avatar: 'Kích thước file không được vượt quá 1MB'
        }));
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      if (errors.avatar) {
        setErrors(prev => ({
          ...prev,
          avatar: ''
        }));
      }
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Mật khẩu hiện tại là bắt buộc';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      const updateData = new FormData();
      updateData.append('fullName', formData.fullName);
      updateData.append('email', formData.email);
      updateData.append('phone', formData.phone);

      if (avatarFile) {
        updateData.append('avatar', avatarFile);
      }

      const response = await apiService.put('/user/profile', updateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user data in localStorage
      const updatedUser = { ...user, ...response.user };
      authService.setUser(updatedUser);
      setUser(updatedUser);

      setSuccess('Cập nhật thông tin thành công!');
    } catch (error) {
      setErrors({ general: error.message || 'Có lỗi xảy ra khi cập nhật thông tin' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      await apiService.put('/user/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setSuccess('Đổi mật khẩu thành công!');
    } catch (error) {
      setErrors({ general: error.message || 'Có lỗi xảy ra khi đổi mật khẩu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-header">
            <div className="user-avatar">
              <img
                src={avatarPreview || '/api/placeholder/80/80'}
                alt="Avatar"
                className="avatar-image"
              />
              <span className="user-name">{user?.fullName || 'Người dùng'}</span>
              <span className="user-edit">✏️ Sửa Hồ Sơ</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section">
              <div className="nav-item">
                <span className="nav-icon">🔔</span>
                <span>Thông Báo</span>
              </div>

              <div className="nav-group">
                <div className="nav-group-title">
                  <span className="nav-icon">👤</span>
                  <span>Tài Khoản Của Tôi</span>
                </div>
                <div className="nav-subitems">
                  <div
                    className={`nav-subitem ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Hồ Sơ
                  </div>
                  <div
                    className={`nav-subitem ${activeTab === 'bank' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bank')}
                  >
                    Ngân Hàng
                  </div>
                  <div
                    className={`nav-subitem ${activeTab === 'address' ? 'active' : ''}`}
                    onClick={() => setActiveTab('address')}
                  >
                    Địa Chỉ
                  </div>
                  <div
                    className={`nav-subitem ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                  >
                    Đổi Mật Khẩu
                  </div>
                  <div className="nav-subitem">
                    Cài Đặt Thông Báo
                  </div>
                  <div className="nav-subitem">
                    Những Thiết Lập Riêng Tư
                  </div>
                  <div className="nav-subitem">
                    Thông Tin Cá Nhân
                  </div>
                </div>
              </div>

              <div className="nav-item">
                <span className="nav-icon">🛒</span>
                <span>Đơn Mua</span>
              </div>

              <div className="nav-item">
                <span className="nav-icon">🎫</span>
                <span>Kho Voucher</span>
              </div>

              <div className="nav-item">
                <span className="nav-icon">💰</span>
                <span>Shopee Xu</span>
              </div>

              <div className="nav-item special">
                <span className="nav-icon">🔥</span>
                <span>9.9 Ngày Siêu Mua Sắm</span>
                <span className="badge">Live</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-content">
              <div className="content-header">
                <h2>Hồ Sơ Của Tôi</h2>
                <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="profile-form">
                {errors.general && (
                  <div className="error-alert">
                    {errors.general}
                  </div>
                )}

                {success && (
                  <div className="success-alert">
                    {success}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-left">
                    <div className="form-group">
                      <label className="form-label">Tên đăng nhập</label>
                      <input
                        type="text"
                        value={user?.email?.split('@')[0] || ''}
                        className="form-control"
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tên</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`form-control ${errors.fullName ? 'error' : ''}`}
                        placeholder="Nhập họ tên"
                      />
                      {errors.fullName && (
                        <span className="error-message">{errors.fullName}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <div className="email-group">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-control ${errors.email ? 'error' : ''}`}
                          placeholder="Nhập email"
                        />
                        <button type="button" className="change-btn">Thay Đổi</button>
                      </div>
                      {errors.email && (
                        <span className="error-message">{errors.email}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Số điện thoại</label>
                      <div className="phone-group">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`form-control ${errors.phone ? 'error' : ''}`}
                          placeholder="Nhập số điện thoại"
                        />
                        <button type="button" className="change-btn">Thay Đổi</button>
                      </div>
                      {errors.phone && (
                        <span className="error-message">{errors.phone}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Giới tính</label>
                      <div className="gender-group">
                        <label className="radio-label">
                          <input type="radio" name="gender" value="male" />
                          <span>Nam</span>
                        </label>
                        <label className="radio-label">
                          <input type="radio" name="gender" value="female" />
                          <span>Nữ</span>
                        </label>
                        <label className="radio-label">
                          <input type="radio" name="gender" value="other" />
                          <span>Khác</span>
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ngày sinh</label>
                      <div className="date-group">
                        <select className="form-select">
                          <option>Ngày</option>
                          {Array.from({length: 31}, (_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                        </select>
                        <select className="form-select">
                          <option>Tháng</option>
                          {Array.from({length: 12}, (_, i) => (
                            <option key={i+1} value={i+1}>Tháng {i+1}</option>
                          ))}
                        </select>
                        <select className="form-select">
                          <option>Năm</option>
                          {Array.from({length: 100}, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return <option key={year} value={year}>{year}</option>
                          })}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="save-btn"
                      disabled={loading}
                    >
                      {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>

                  <div className="form-right">
                    <div className="avatar-section">
                      <div className="avatar-container">
                        <img
                          src={avatarPreview || '/api/placeholder/120/120'}
                          alt="Avatar"
                          className="profile-avatar"
                        />
                      </div>
                      <input
                        type="file"
                        id="avatar-input"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="avatar-input" className="avatar-btn">
                        Chọn Ảnh
                      </label>
                      <div className="avatar-info">
                        <p>Dung lượng file tối đa 1 MB</p>
                        <p>Định dạng: JPEG, PNG</p>
                      </div>
                      {errors.avatar && (
                        <span className="error-message">{errors.avatar}</span>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="profile-content">
              <div className="content-header">
                <h2>Đổi Mật Khẩu</h2>
                <p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="password-form">
                {errors.general && (
                  <div className="error-alert">
                    {errors.general}
                  </div>
                )}

                {success && (
                  <div className="success-alert">
                    {success}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={`form-control ${errors.currentPassword ? 'error' : ''}`}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  {errors.currentPassword && (
                    <span className="error-message">{errors.currentPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`form-control ${errors.newPassword ? 'error' : ''}`}
                    placeholder="Nhập mật khẩu mới"
                  />
                  {errors.newPassword && (
                    <span className="error-message">{errors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="profile-content">
              <div className="content-header">
                <h2>Ngân Hàng</h2>
                <p>Quản lý thông tin ngân hàng của bạn</p>
              </div>
              <div className="coming-soon">
                <p>Tính năng đang được phát triển</p>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="profile-content">
              <div className="content-header">
                <h2>Địa Chỉ</h2>
                <p>Quản lý địa chỉ giao hàng</p>
              </div>
              <div className="coming-soon">
                <p>Tính năng đang được phát triển</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;