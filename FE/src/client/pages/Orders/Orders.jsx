import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OrderService } from '../../services/orderService';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getUserOrders();
      if (response.code === 200) {
        // API now returns array of orders
        const orderData = response.orders || [];
        setOrders(orderData);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      shipping: 'status-shipping',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return classMap[status] || '';
  };

  const calculateTotal = (products) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.reduce((total, product) => {
      const price = product.price || 0;
      const quantity = product.quantity || 0;
      const discount = product.discountPercentage || 0;
      const discountedPrice = price * (1 - discount / 100);
      return total + (discountedPrice * quantity);
    }, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleCreateTestOrder = async () => {
    // Create a test order for demo purposes
    const testOrder = {
      status: "shipping",
      userInfo: {
        fullName: "Nguyễn Văn A",
        phone: "0123456789",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        toadoa: {
          type: "Point",
          coordinates: [105.860000, 21.030000] // Slightly different from store location
        }
      },
      products: [
        {
          product_id: "test123",
          title: "Xiami 123",
          thumbnail: "https://via.placeholder.com/300x300?text=Xiami+123",
          price: 299000,
          discountPercentage: 10,
          quantity: 2
        }
      ]
    };

    try {
      const response = await OrderService.createOrder(testOrder);
      if (response?.message) {
        toast.success('Tạo đơn hàng test thành công!');
        fetchOrders(); // Refresh orders list
      }
    } catch (error) {
      console.error('Error creating test order:', error);
      toast.error('Có lỗi xảy ra khi tạo đơn hàng test');
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>Đơn hàng của tôi</h1>
          <div className="header-actions">
            <button 
              className="test-order-btn"
              onClick={handleCreateTestOrder}
            >
              Tạo đơn hàng test
            </button>
            <button 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              ← Về trang chủ
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả ({orders.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Chờ xử lý ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'shipping' ? 'active' : ''}`}
            onClick={() => setFilter('shipping')}
          >
            Đang giao ({orders.filter(o => o.status === 'shipping').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Đã giao ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>

        {/* Orders list */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Chưa có đơn hàng nào</h3>
              <p>Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
              <Link to="/products" className="shop-now-btn">
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Đơn hàng #{order._id?.slice(-8)}</h3>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-status-container">
                    <span className={`order-status ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    {order.status === 'shipping' && (
                      <span className="tracking-badge">📍 Có thể theo dõi</span>
                    )}
                  </div>
                </div>

                <div className="order-products">
                  {order.products?.slice(0, 3).map((product, index) => (
                    <div key={index} className="product-preview">
                      <img
                        src={product.thumbnail || 'https://via.placeholder.com/300x300?text=No+Image'}
                        alt={product.title}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                      />
                      <div className="product-info">
                        <span className="product-name">{product.title}</span>
                        <span className="product-quantity">x{product.quantity}</span>
                      </div>
                    </div>
                  ))}
                  {order.products?.length > 3 && (
                    <div className="more-products">
                      +{order.products.length - 3} sản phẩm khác
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span className="total-label">Tổng tiền:</span>
                    <span className="total-amount">
                      {calculateTotal(order.products).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="order-actions">
                    <Link 
                      to={`/orders/${order._id}`} 
                      className="view-detail-btn"
                    >
                      Xem chi tiết
                    </Link>
                    {order.status === 'shipping' && (
                      <Link 
                        to={`/orders/${order._id}`} 
                        className="track-order-btn"
                      >
                        📍 Theo dõi đơn hàng
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
