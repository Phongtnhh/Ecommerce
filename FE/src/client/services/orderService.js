import { apiService } from '../../shared/services/api';

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
