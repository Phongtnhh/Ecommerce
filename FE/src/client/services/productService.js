import { apiService } from '../../shared/services/api';

export const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    try {
      const response = await apiService.get('/products', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const response = await apiService.get(`/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await apiService.get('/products/featured', {
        params: { limit }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const response = await apiService.get(`/categories/${categoryId}/products`, {
        params
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    try {
      const response = await apiService.get('/products/search', {
        params: { q: query, ...params }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    try {
      const response = await apiService.get(`/products/${productId}/reviews`, {
        params
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add product review
  addProductReview: async (productId, reviewData) => {
    try {
      const response = await apiService.post(`/products/${productId}/reviews`, reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    try {
      const response = await apiService.get(`/products/${productId}/related`, {
        params: { limit }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default productService;
