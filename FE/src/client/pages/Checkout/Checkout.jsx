import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OrderService } from '../../services/orderService';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData, selectedProducts, totalAmount } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  // Redirect if no order data
  useEffect(() => {
    if (!orderData || !selectedProducts || selectedProducts.length === 0) {
      toast.error('Không có thông tin đơn hàng');
      navigate('/cart');
    }
  }, [orderData, selectedProducts, navigate]);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      // Nếu là thanh toán COD
      if (paymentMethod === 'cod') {
        const orderPayload = {
          status: "pending",
          userInfo: orderData.userInfo,
          products: selectedProducts.map(item => ({
            product_id: item.product_id,
            price: item.productInfo.price,
            discountPercentage: item.productInfo.discountPercentage || 0,
            quantity: item.quantity
          }))
        };

        const response = await OrderService.createOrder(orderPayload);
        if (response?.message) {
          // Remove products from cart after successful order
          const productIds = selectedProducts.map(item => item.product_id);
          try {
            await OrderService.removeProductsFromCart(productIds);
          } catch (cartError) {
            console.error('Error removing products from cart:', cartError);
            // Don't show error to user as order was successful
          }

          toast.success('Đặt hàng thành công!');
          navigate('/orders');
        }
      } 
      // Nếu là thanh toán online
      else if (paymentMethod === 'zalopay' || paymentMethod === 'momo') {
        // Tạo đơn hàng trước
        const orderPayload = {
          status: "pending_payment",
          userInfo: orderData.userInfo,
          products: selectedProducts.map(item => ({
            product_id: item.product_id,
            price: item.productInfo.price,
            discountPercentage: item.productInfo.discountPercentage || 0,
            quantity: item.quantity
          }))
        };

        const orderResponse = await OrderService.createOrder(orderPayload);

        if (orderResponse?.order) {
          // Remove products from cart after successful order creation
          const productIds = selectedProducts.map(item => item.product_id);
          try {
            await OrderService.removeProductsFromCart(productIds);
          } catch (cartError) {
            console.error('Error removing products from cart:', cartError);
            // Don't show error to user as order was successful
          }

          // Tạo link thanh toán
          const paymentData = {
            total: totalAmount,
            amount: totalAmount,
            orderInfo: `Thanh toán đơn hàng #${orderResponse.order._id} - ${orderData.userInfo.fullName}`,
            returnUrl: window.location.origin,
            redirectUrl: window.location.origin + '/orders'
          };

          let paymentResponse;
          if (paymentMethod === 'zalopay') {
            paymentResponse = await OrderService.createZaloPayment(paymentData);
          } else {
            paymentResponse = await OrderService.createMomoPayment(paymentData);
          }

          // Chuyển hướng đến trang thanh toán
          if (paymentResponse?.paymentUrl) {
            window.location.href = paymentResponse.paymentUrl;
          } else if (paymentResponse?.payUrl) {
            window.location.href = paymentResponse.payUrl;
          } else {
            toast.error('Không thể tạo liên kết thanh toán');
          }
        }
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Có lỗi xảy ra khi thanh toán');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData || !selectedProducts) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Xác nhận thanh toán</h1>
          <button 
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </button>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Thông tin đơn hàng</h2>
            
            <div className="customer-info">
              <h3>Thông tin khách hàng</h3>
              <p><strong>Họ tên:</strong> {orderData.userInfo.fullName}</p>
              <p><strong>Số điện thoại:</strong> {orderData.userInfo.phone}</p>
              <p><strong>Địa chỉ:</strong> {orderData.userInfo.address}</p>
            </div>

            <div className="products-list">
              <h3>Sản phẩm đã chọn</h3>
              {selectedProducts.map(item => (
                <div key={item.product_id} className="product-item">
                  <img 
                    src={item.productInfo.thumbnail} 
                    alt={item.productInfo.title}
                    className="product-image"
                  />
                  <div className="product-details">
                    <h4>{item.productInfo.title}</h4>
                    <p>Số lượng: {item.quantity}</p>
                    <p className="price">
                      {(item.productInfo.price * item.quantity).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="total-amount">
              <h3>Tổng tiền: {totalAmount.toLocaleString('vi-VN')}đ</h3>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-section">
            <h2>Phương thức thanh toán</h2>
            
            <div className="payment-methods">
              <div className="payment-option">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={handlePaymentMethodChange}
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
                  checked={paymentMethod === 'momo'}
                  onChange={handlePaymentMethodChange}
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
                  checked={paymentMethod === 'zalopay'}
                  onChange={handlePaymentMethodChange}
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

            <div className="checkout-actions">
              <button
                className="confirm-order-btn"
                onClick={handleConfirmOrder}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
