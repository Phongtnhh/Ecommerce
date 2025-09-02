import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OrderService } from '../../services/orderService';
import MapSelector from '../../components/Map/MapSelector';
import './Order.css';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProducts = [], totalAmount = 0 } = location.state || {};

  const [orderData, setOrderData] = useState({
    fullName: '',
    phone: '',
    address: '',
    coordinates: null,
    paymentMethod: 'cod' // Default to cash on delivery
  });
  const [isMapMode, setIsMapMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if no products selected
  useEffect(() => {
    if (!selectedProducts || selectedProducts.length === 0) {
      toast.error('Vui lòng chọn sản phẩm từ giỏ hàng');
      navigate('/cart');
    }
  }, [selectedProducts, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMapLocationSelect = (address, coordinates) => {
    setOrderData(prev => ({
      ...prev,
      address,
      coordinates
    }));
    toast.success('Đã chọn địa chỉ trên bản đồ');
  };

  const validateForm = () => {
    if (!orderData.fullName.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }
    if (!orderData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!orderData.address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return false;
    }
    if (!orderData.coordinates) {
      toast.error('Vui lòng chọn vị trí trên bản đồ hoặc lấy vị trí hiện tại');
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderPayload = {
        status: "pending",
        userInfo: {
          fullName: orderData.fullName,
          phone: orderData.phone,
          address: orderData.address,
          toadoa: {
            type: "Point",
            coordinates: orderData.coordinates
          }
        },
        products: selectedProducts.map(item => ({
          product_id: item.product_id,
          price: item.productInfo.price,
          discountPercentage: item.productInfo.discountPercentage || 0,
          quantity: item.quantity
        }))
      };

      const response = await OrderService.createOrder(orderPayload);
      if (response?.message) {
        toast.success('Đặt hàng thành công!');
        navigate('/orders');
      }

    } catch (error) {
      console.error('Order error:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProducts || selectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="order-page">
      <div className="container">
        <div className="order-header">
          <h1>Đặt hàng</h1>
          <button 
            className="back-btn"
            onClick={() => navigate('/cart')}
          >
            ← Quay lại giỏ hàng
          </button>
        </div>

        <div className="order-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Thông tin đơn hàng</h2>
            <div className="order-items">
              {selectedProducts.map((item) => (
                <div key={item.product_id} className="order-item">
                  <div className="item-image">
                    <img src={item.productInfo?.thumbnail} alt={item.productInfo?.title} />
                  </div>
                  <div className="item-info">
                    <h3>{item.productInfo?.title}</h3>
                    <div className="item-details">
                      <span>Số lượng: {item.quantity}</span>
                      <span>Đơn giá: ₫{item.productInfo?.price?.toLocaleString()}</span>
                      <span className="item-total">
                        Thành tiền: ₫{(item.productInfo?.price * item.quantity)?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Tổng cộng: ₫{totalAmount.toLocaleString()}</strong>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="delivery-info">
            <h2>Thông tin giao hàng</h2>
            <form className="delivery-form">
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={orderData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={orderData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ giao hàng *</label>
                <div className="address-input-group">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={orderData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ chi tiết"
                    required
                  />
                  <button
                    type="button"
                    className="map-btn"
                    onClick={() => setIsMapMode(!isMapMode)}
                  >
                    {isMapMode ? 'Đóng bản đồ' : 'Chọn trên bản đồ'}
                  </button>
                </div>
              </div>

              {orderData.coordinates && (
                <div className="coordinates-info">
                  <span>Tọa độ: {orderData.coordinates[1]}, {orderData.coordinates[0]}</span>
                </div>
              )}

              {isMapMode && (
                <MapSelector
                  onLocationSelect={handleMapLocationSelect}
                  initialPosition={orderData.coordinates}
                />
              )}

              {/* Payment Method */}
              <div className="form-group">
                <label>Phương thức thanh toán *</label>
                <div className="payment-methods">
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={orderData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="cod" className="payment-label">
                      <div className="payment-icon">💵</div>
                      <div className="payment-info">
                        <span className="payment-name">Thanh toán khi nhận hàng</span>
                        <span className="payment-desc">Trả tiền mặt khi nhận hàng</span>
                      </div>
                    </label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="momo"
                      name="paymentMethod"
                      value="momo"
                      checked={orderData.paymentMethod === 'momo'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="momo" className="payment-label">
                      <div className="payment-icon">
                        <img src="https://developers.momo.vn/v3/assets/images/square-logo.svg" alt="MoMo" />
                      </div>
                      <div className="payment-info">
                        <span className="payment-name">Ví MoMo</span>
                        <span className="payment-desc">Thanh toán qua ví điện tử MoMo</span>
                      </div>
                    </label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="zalopay"
                      name="paymentMethod"
                      value="zalopay"
                      checked={orderData.paymentMethod === 'zalopay'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="zalopay" className="payment-label">
                      <div className="payment-icon">
                        <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" alt="ZaloPay" />
                      </div>
                      <div className="payment-info">
                        <span className="payment-name">ZaloPay</span>
                        <span className="payment-desc">Thanh toán qua ví điện tử ZaloPay</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Actions */}
          <div className="order-actions">
            <button
              className="submit-order-btn"
              onClick={handleSubmitOrder}
              disabled={loading || !orderData.coordinates}
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
