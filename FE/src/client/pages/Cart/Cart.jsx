import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartService } from '../../services/cartService';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchCart = useCallback(async () => {
    try {
      const response = await CartService.getCart();
      if (response?.code === 200) {
        let cart = response.cart;
        cart.products.map(item => {
          item.totalPrice = item.productInfo.price * item.quantity;
        })
        setCart(cart);

        // Update cart count in header
        updateCartCount(cart);
      }

    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(cart.products.map(item => item.product_id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (productId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, productId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== productId));
    }
  };

  const updateCartCount = (cart) => {
    const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('countCart', totalQuantity);
    // Trigger header re-render by dispatching custom event
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: totalQuantity } }));
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Call API to update quantity
      await CartService.updateQuantity({ product_id: productId, quantity: newQuantity });

      // Update local state
      const updatedCart = {
        ...cart,
        products: cart.products.map(item =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity, totalPrice: item.productInfo.price * newQuantity }
            : item
        )
      };
      updatedCart.totalPrice = updatedCart.products.reduce((sum, item) => sum + item.totalPrice, 0);
      setCart(updatedCart);

      // Update cart count in header
      updateCartCount(updatedCart);

      toast.success('Đã cập nhật số lượng');
    } catch (error) {
      toast.error('Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await CartService.removeItem({ product_id: productId });
      const updatedCart = {
        ...cart,
        products: cart.products.filter(item => item.product_id !== productId)
      };
      updatedCart.totalPrice = updatedCart.products.reduce((sum, item) => sum + item.totalPrice, 0);
      setCart(updatedCart);
      setSelectedItems(selectedItems.filter(id => id !== productId));

      // Update cart count in header
      updateCartCount(updatedCart);

      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error('Không thể xóa sản phẩm');
    }
  };

  const calculateSelectedTotal = () => {
    return cart.products
      .filter(item => selectedItems.includes(item.product_id))
      .reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;

    const selectedProducts = cart.products.filter(item =>
      selectedItems.includes(item.product_id)
    );

    // Navigate to order page with selected products
    navigate('/order', {
      state: {
        selectedProducts,
        totalAmount: calculateSelectedTotal()
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (!cart || cart.products.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link to="/products" className="continue-shopping-btn">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Giỏ hàng ({cart.products.length} sản phẩm)</h1>
        </div>

        <div className="cart-content">
          <div className="cart-table">
            {/* Table Header */}
            <div className="cart-table-header">
              <div className="header-checkbox">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cart.products.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </div>
              <div className="header-product">Sản Phẩm</div>
              <div className="header-price">Đơn Giá</div>
              <div className="header-quantity">Số Lượng</div>
              <div className="header-total">Số Tiền</div>
              <div className="header-actions">Thao Tác</div>
            </div>

            {/* Cart Items */}
            <div className="cart-items">
              {cart.products.map((item) => (
                <div key={item.product_id} className="cart-item">
                  <div className="item-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.product_id)}
                      onChange={(e) => handleSelectItem(item.product_id, e.target.checked)}
                    />
                  </div>
                  
                  <div className="item-product">
                    <div className="product-image">
                      <img src={item.productInfo?.thumbnail} alt={item.productInfo?.title} />
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{item.productInfo?.title}</h3>
                      <div className="product-variant">
                        Phân Loại Hàng: <span>Mặc định</span>
                      </div>
                    </div>
                  </div>

                  <div className="item-price">
                    <span className="current-price">{item.productInfo?.price?.toLocaleString()} ₫</span>
                    {item.productInfo?.discountPercentage > 0 && (
                      <div className="discount-info">
                        <span className="discount-badge">Giảm {item.productInfo.discountPercentage}%</span>
                      </div>
                    )}
                  </div>

                  <div className="item-quantity">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value))}
                        min="1"
                        className="quantity-input"
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <span className="total-price">{item.totalPrice?.toLocaleString()}₫</span>
                  </div>

                  <div className="item-actions">
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.product_id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-row">
              <span>Tạm tính ({selectedItems.length} sản phẩm):</span>
              <span className="summary-price">₫{calculateSelectedTotal().toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span className="total-price">₫{calculateSelectedTotal().toLocaleString()}</span>
            </div>
            <button
              className="checkout-btn"
              disabled={selectedItems.length === 0}
              onClick={handleCheckout}
            >
              Mua Hàng ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;