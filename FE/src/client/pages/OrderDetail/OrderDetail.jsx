import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OrderService } from '../../services/orderService';
import OrderTrackingMap from '../../components/Map/OrderTrackingMap';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDriverLocation, setCurrentDriverLocation] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Mock driver location for demo (in real app, this would come from API)
  const mockDriverLocations = {
    // Simulate driver moving from store to customer
    pending: null,
    shipping: [105.850000, 21.025000], // Somewhere between store and customer
    delivered: null,
    cancelled: null
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  // Simulate driver location updates for shipping orders
  useEffect(() => {
    if (order && order.status === 'shipping') {
      const interval = setInterval(() => {
        // Simulate driver movement (in real app, this would be real-time updates)
        const randomOffset = 0.001;
        const baseLocation = mockDriverLocations.shipping;
        setCurrentDriverLocation([
          baseLocation[0] + (Math.random() - 0.5) * randomOffset,
          baseLocation[1] + (Math.random() - 0.5) * randomOffset
        ]);
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [order]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getOrderDetail(id);
      if (response.code === 200) {
        setOrder(response.order);
        
        // Set initial driver location if order is shipping
        if (response.order.status === 'shipping') {
          setCurrentDriverLocation(mockDriverLocations.shipping);
        }
      } else {
        toast.error('Không tìm thấy đơn hàng');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin đơn hàng');
      navigate('/orders');
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

  const calculateTotal = () => {
    if (!order || !order.products) return 0;
    return order.products.reduce((total, product) => {
      const price = product.price || 0;
      const quantity = product.quantity || 0;
      const discount = product.discountPercentage || 0;
      const discountedPrice = price * (1 - discount / 100);
      return total + (discountedPrice * quantity);
    }, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    setCancelling(true);
    try {
      const response = await OrderService.cancelOrder(order._id);
      if (response.code === 200) {
        setOrder(prev => ({ ...prev, status: 'cancelled' }));
        toast.success('Đã hủy đơn hàng thành công');
      } else {
        toast.error('Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  const canCancelOrder = () => {
    return order && (order.status === 'pending' || order.status === 'confirmed');
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="error-container">
            <h2>Không tìm thấy đơn hàng</h2>
            <button onClick={() => navigate('/orders')} className="back-btn">
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mock store location (in real app, this would come from order data)
  const storeLocation = [105.854444, 21.028511]; // Hanoi center
  const customerLocation = order.userInfo?.toadoa?.coordinates;

  return (
    <div className="order-detail-page">
      <div className="container">
        <div className="order-detail-header">
          <button
            className="back-btn"
            onClick={() => navigate('/orders')}
          >
            ← Quay lại
          </button>
          <div className="order-title">
            <h1>Chi tiết đơn hàng #{order._id?.slice(-8)}</h1>
            <div className="order-title-actions">
              <span className={`order-status ${getStatusClass(order.status)}`}>
                {getStatusText(order.status)}
              </span>
              {canCancelOrder() && (
                <button
                  className="cancel-order-btn"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                >
                  {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="order-detail-content">
          {/* Order Tracking Map - Only show for shipping orders */}
          {order.status === 'shipping' && customerLocation && (
            <div className="tracking-section">
              <h2>Theo dõi đơn hàng</h2>
              <OrderTrackingMap
                orderLocation={storeLocation}
                deliveryLocation={customerLocation}
                currentDriverLocation={currentDriverLocation}
                orderStatus={order.status}
              />
            </div>
          )}

          {/* Status Information */}
          {order.status === 'cancelled' && (
            <div className="status-alert cancelled-alert">
              <h3>⚠️ Đơn hàng đã bị hủy</h3>
              <p>Đơn hàng này đã được hủy. Nếu bạn đã thanh toán, số tiền sẽ được hoàn lại trong 3-5 ngày làm việc.</p>
            </div>
          )}

          {order.status === 'pending' && (
            <div className="status-alert pending-alert">
              <h3>⏳ Đơn hàng đang chờ xử lý</h3>
              <p>Đơn hàng của bạn đang được xử lý. Bạn có thể hủy đơn hàng nếu cần thiết.</p>
            </div>
          )}

          {order.status === 'shipping' && (
            <div className="status-alert shipping-alert">
              <h3>🚚 Đơn hàng đang được giao</h3>
              <p>Đơn hàng của bạn đang trên đường giao đến. Bạn có thể theo dõi vị trí giao hàng trên bản đồ bên dưới.</p>
            </div>
          )}

          <div className="order-info-grid">
            {/* Order Information */}
            <div className="order-info-card">
              <h3>Thông tin đơn hàng</h3>
              <div className="info-row">
                <span className="label">Mã đơn hàng:</span>
                <span className="value">#{order._id?.slice(-8)}</span>
              </div>
              <div className="info-row">
                <span className="label">Ngày đặt:</span>
                <span className="value">{formatDate(order.createdAt)}</span>
              </div>
              <div className="info-row">
                <span className="label">Trạng thái:</span>
                <span className={`value ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Tổng tiền:</span>
                <span className="value total-amount">
                  {calculateTotal().toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="customer-info-card">
              <h3>Thông tin khách hàng</h3>
              <div className="info-row">
                <span className="label">Họ tên:</span>
                <span className="value">{order.userInfo?.fullName}</span>
              </div>
              <div className="info-row">
                <span className="label">Số điện thoại:</span>
                <span className="value">{order.userInfo?.phone}</span>
              </div>
              <div className="info-row">
                <span className="label">Địa chỉ:</span>
                <span className="value">{order.userInfo?.address}</span>
              </div>
              {customerLocation && (
                <div className="info-row">
                  <span className="label">Tọa độ:</span>
                  <span className="value">
                    {customerLocation[1]?.toFixed(6)}, {customerLocation[0]?.toFixed(6)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Products List */}
          <div className="products-section">
            <h3>Sản phẩm đã đặt</h3>
            <div className="products-list">
              {order.products?.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-image">
                    <img
                      src={product.thumbnail || 'https://via.placeholder.com/300x300?text=No+Image'}
                      alt={product.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="product-details">
                    <h4>{product.title}</h4>
                    <div className="product-meta">
                      <span>Số lượng: {product.quantity}</span>
                      <span>Đơn giá: {product.price?.toLocaleString('vi-VN')}đ</span>
                      {product.discountPercentage > 0 && (
                        <span className="discount">Giảm {product.discountPercentage}%</span>
                      )}
                    </div>
                  </div>
                  <div className="product-total">
                    {((product.price * (1 - (product.discountPercentage || 0) / 100)) * product.quantity).toLocaleString('vi-VN')}đ
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

export default OrderDetail;
