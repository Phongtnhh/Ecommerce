import { apiService } from '../../shared/services/api';
import { CartService } from './cartService';

export const OrderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await apiService.post("/order/post", orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      const response = await apiService.get("/order/view");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get order detail by ID
  getOrderDetail: async (orderId) => {
    try {
      const response = await apiService.get(`/order/detail/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create payment URL for ZaloPay (VNPay)
  createZaloPayment: async (paymentData) => {
    try {
      const response = await apiService.post("/checkout/create_payment_url", paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create payment URL for MoMo
  createMomoPayment: async (paymentData) => {
    try {
      const response = await apiService.post("/checkout/create_payment_urlMomo", paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await apiService.patch(`/order/edit/${orderId}`, {
        status: 'cancelled'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Remove products from cart after successful order
  removeProductsFromCart: async (productIds) => {
    try {
      const response = await CartService.removeItem({ productIds });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiService.patch(`/order/edit/${orderId}`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default OrderService;
