import { apiService } from '../../shared/services/api';

export const adminOrderService = {
  // Get all orders with filters and pagination
  getOrders: async (params = {}) => {
    try {
      const response = await apiService.get('/admin/orders', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single order by ID
  getOrderById: async (id) => {
    try {
      const response = await apiService.get(`/admin/orders/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (id, status, note = '') => {
    try {
      const response = await apiService.patch(`/admin/orders/${id}/status`, {
        status,
        note
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by status
  getOrdersByStatus: async (status, params = {}) => {
    try {
      const response = await apiService.get(`/admin/orders/status/${status}`, {
        params
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async (period = 'month') => {
    try {
      const response = await apiService.get('/admin/orders/stats', {
        params: { period }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    try {
      const response = await apiService.get('/admin/orders/recent', {
        params: { limit }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (id, reason = '') => {
    try {
      const response = await apiService.patch(`/admin/orders/${id}/cancel`, {
        reason
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Process refund
  processRefund: async (orderId, amount, reason = '') => {
    try {
      const response = await apiService.post(`/admin/orders/${orderId}/refund`, {
        amount,
        reason
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export orders
  exportOrders: async (params = {}) => {
    try {
      const response = await apiService.download(
        '/admin/orders/export',
        'orders.csv'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default adminOrderService;
