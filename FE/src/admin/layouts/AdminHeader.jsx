import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = ({ sidebarCollapsed, onSidebarToggle }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data - replace with actual data from context/store
  const notifications = [
    { id: 1, message: 'Đơn hàng mới #12345', time: '5 phút trước', type: 'order' },
    { id: 2, message: 'Sản phẩm sắp hết hàng', time: '10 phút trước', type: 'warning' },
    { id: 3, message: 'Khách hàng mới đăng ký', time: '15 phút trước', type: 'user' }
  ];

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/admin/login');
  };

  const handleProfileClick = () => {
    navigate('/admin/profile');
    setIsProfileMenuOpen(false);
  };

  return (
    <header className={`admin-header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <button 
          className="sidebar-toggle-btn"
          onClick={onSidebarToggle}
        >
          ☰
        </button>
        
        <div className="breadcrumb">
          <span className="breadcrumb-item">Dashboard</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Tổng quan</span>
        </div>
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="header-search">
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>

        {/* Notifications */}
        <div className="notification-dropdown">
          <button 
            className="notification-btn"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            🔔
            <span className="notification-badge">{notifications.length}</span>
          </button>
          
          {isNotificationOpen && (
            <div className="notification-menu">
              <div className="notification-header">
                <h4>Thông báo</h4>
                <button className="mark-all-read">Đánh dấu đã đọc</button>
              </div>
              <div className="notification-list">
                {notifications.map(notification => (
                  <div key={notification.id} className="notification-item">
                    <div className="notification-icon">
                      {notification.type === 'order' && '🛒'}
                      {notification.type === 'warning' && '⚠️'}
                      {notification.type === 'user' && '👤'}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <button className="view-all-btn">Xem tất cả</button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn" title="Thêm sản phẩm">
            ➕
          </button>
          <button className="quick-action-btn" title="Cài đặt">
            ⚙️
          </button>
        </div>

        {/* Profile Menu */}
        <div className="profile-dropdown">
          <button 
            className="profile-btn"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <div className="profile-avatar">👤</div>
            <div className="profile-info">
              <span className="profile-name">Admin User</span>
              <span className="profile-role">Quản trị viên</span>
            </div>
            <span className="dropdown-arrow">▼</span>
          </button>

          {isProfileMenuOpen && (
            <div className="profile-menu">
              <button onClick={handleProfileClick} className="profile-menu-item">
                <span className="menu-icon">👤</span>
                Hồ sơ cá nhân
              </button>
              <button className="profile-menu-item">
                <span className="menu-icon">⚙️</span>
                Cài đặt tài khoản
              </button>
              <button className="profile-menu-item">
                <span className="menu-icon">🔒</span>
                Đổi mật khẩu
              </button>
              <hr className="menu-divider" />
              <button onClick={handleLogout} className="profile-menu-item logout">
                <span className="menu-icon">🚪</span>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
