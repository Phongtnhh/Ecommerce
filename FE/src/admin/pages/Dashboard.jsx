import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setStats({
        totalRevenue: 125000000,
        totalOrders: 1250,
        totalProducts: 450,
        totalCustomers: 890,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        productsGrowth: 5.2,
        customersGrowth: 15.7
      });

      setRecentOrders([
        { id: '#12345', customer: 'Nguyễn Văn A', total: 1500000, status: 'pending', date: '2024-01-15' },
        { id: '#12346', customer: 'Trần Thị B', total: 850000, status: 'completed', date: '2024-01-15' },
        { id: '#12347', customer: 'Lê Văn C', total: 2200000, status: 'processing', date: '2024-01-14' },
        { id: '#12348', customer: 'Phạm Thị D', total: 650000, status: 'completed', date: '2024-01-14' },
        { id: '#12349', customer: 'Hoàng Văn E', total: 1800000, status: 'pending', date: '2024-01-13' }
      ]);

      setTopProducts([
        { id: 1, name: 'iPhone 15 Pro', sales: 125, revenue: 3125000000 },
        { id: 2, name: 'Samsung Galaxy S24', sales: 98, revenue: 2156000000 },
        { id: 3, name: 'MacBook Air M2', sales: 67, revenue: 2010000000 },
        { id: 4, name: 'AirPods Pro', sales: 234, revenue: 1170000000 }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Chờ xử lý', class: 'status-pending' },
      processing: { text: 'Đang xử lý', class: 'status-processing' },
      completed: { text: 'Hoàn thành', class: 'status-completed' },
      cancelled: { text: 'Đã hủy', class: 'status-cancelled' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Tổng quan về hoạt động kinh doanh</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">Doanh thu</h3>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value">
            {stats.totalRevenue.toLocaleString('vi-VN')}đ
          </div>
          <div className={`stat-change ${stats.revenueGrowth > 0 ? 'positive' : 'negative'}`}>
            <span>{stats.revenueGrowth > 0 ? '↗️' : '↘️'}</span>
            {Math.abs(stats.revenueGrowth)}% so với tháng trước
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">Đơn hàng</h3>
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-value">
            {stats.totalOrders.toLocaleString('vi-VN')}
          </div>
          <div className={`stat-change ${stats.ordersGrowth > 0 ? 'positive' : 'negative'}`}>
            <span>{stats.ordersGrowth > 0 ? '↗️' : '↘️'}</span>
            {Math.abs(stats.ordersGrowth)}% so với tháng trước
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">Sản phẩm</h3>
            <span className="stat-icon">🛍️</span>
          </div>
          <div className="stat-value">
            {stats.totalProducts.toLocaleString('vi-VN')}
          </div>
          <div className={`stat-change ${stats.productsGrowth > 0 ? 'positive' : 'negative'}`}>
            <span>{stats.productsGrowth > 0 ? '↗️' : '↘️'}</span>
            {Math.abs(stats.productsGrowth)}% so với tháng trước
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">Khách hàng</h3>
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-value">
            {stats.totalCustomers.toLocaleString('vi-VN')}
          </div>
          <div className={`stat-change ${stats.customersGrowth > 0 ? 'positive' : 'negative'}`}>
            <span>{stats.customersGrowth > 0 ? '↗️' : '↘️'}</span>
            {Math.abs(stats.customersGrowth)}% so với tháng trước
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Orders */}
        <div className="admin-card">
          <div className="card-header">
            <h2 className="card-title">Đơn hàng gần đây</h2>
            <button className="btn-admin btn-outline">Xem tất cả</button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td className="order-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="order-total">
                        {order.total.toLocaleString('vi-VN')}đ
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <button className="btn-admin btn-sm btn-primary">
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="admin-card">
          <div className="card-header">
            <h2 className="card-title">Sản phẩm bán chạy</h2>
            <button className="btn-admin btn-outline">Xem báo cáo</button>
          </div>
          <div className="card-body">
            <div className="top-products-list">
              {topProducts.map((product, index) => (
                <div key={product.id} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>
                    <div className="product-stats">
                      <span className="sales-count">{product.sales} đã bán</span>
                      <span className="revenue-amount">
                        {product.revenue.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
