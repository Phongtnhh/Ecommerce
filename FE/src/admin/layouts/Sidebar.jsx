import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: '📊',
      exact: true
    },
    {
      title: 'Sản phẩm',
      icon: '📦',
      children: [
        { title: 'Danh sách sản phẩm', path: '/admin/products', icon: '📋' },
        { title: 'Thêm sản phẩm', path: '/admin/products/create', icon: '➕' },
        { title: 'Danh mục', path: '/admin/categories', icon: '🏷️' }
      ]
    },
    {
      title: 'Đơn hàng',
      icon: '🛒',
      children: [
        { title: 'Danh sách đơn hàng', path: '/admin/orders', icon: '📋' },
        { title: 'Đơn hàng chờ xử lý', path: '/admin/orders/pending', icon: '⏳' },
        { title: 'Đơn hàng đã giao', path: '/admin/orders/delivered', icon: '✅' }
      ]
    },
    {
      title: 'Khách hàng',
      icon: '👥',
      children: [
        { title: 'Danh sách khách hàng', path: '/admin/customers', icon: '📋' },
        { title: 'Khách hàng VIP', path: '/admin/customers/vip', icon: '⭐' }
      ]
    },
    {
      title: 'Báo cáo',
      icon: '📈',
      children: [
        { title: 'Doanh thu', path: '/admin/reports/revenue', icon: '💰' },
        { title: 'Sản phẩm bán chạy', path: '/admin/reports/bestsellers', icon: '🔥' },
        { title: 'Thống kê khách hàng', path: '/admin/reports/customers', icon: '👤' }
      ]
    },
    {
      title: 'Cài đặt',
      icon: '⚙️',
      children: [
        { title: 'Cài đặt chung', path: '/admin/settings/general', icon: '🔧' },
        { title: 'Thanh toán', path: '/admin/settings/payment', icon: '💳' },
        { title: 'Giao hàng', path: '/admin/settings/shipping', icon: '🚚' }
      ]
    }
  ];

  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const renderMenuItem = (item, index) => {
    if (item.children) {
      const isExpanded = expandedItems[index];
      const hasActiveChild = item.children.some(child => isActive(child.path));
      
      return (
        <li key={index} className="menu-item has-children">
          <button
            className={`menu-link ${hasActiveChild ? 'active' : ''}`}
            onClick={() => toggleExpanded(index)}
          >
            <span className="menu-icon">{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className="menu-text">{item.title}</span>
                <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                  ▼
                </span>
              </>
            )}
          </button>
          {!isCollapsed && (
            <ul className={`submenu ${isExpanded ? 'expanded' : ''}`}>
              {item.children.map((child, childIndex) => (
                <li key={childIndex} className="submenu-item">
                  <Link
                    to={child.path}
                    className={`submenu-link ${isActive(child.path) ? 'active' : ''}`}
                  >
                    <span className="submenu-icon">{child.icon}</span>
                    <span className="submenu-text">{child.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={index} className="menu-item">
        <Link
          to={item.path}
          className={`menu-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
        >
          <span className="menu-icon">{item.icon}</span>
          {!isCollapsed && <span className="menu-text">{item.title}</span>}
        </Link>
      </li>
    );
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🛍️</span>
          {!isCollapsed && <span className="logo-text">Admin Panel</span>}
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {isCollapsed ? '▶️' : '◀️'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          {!isCollapsed && (
            <div className="user-details">
              <div className="user-name">Admin User</div>
              <div className="user-role">Quản trị viên</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
