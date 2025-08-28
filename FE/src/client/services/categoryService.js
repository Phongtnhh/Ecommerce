import { apiService } from '../../shared/services/api';

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await apiService.get('/categories');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await apiService.get(`/categories/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get category tree (with subcategories)
  getCategoryTree: async () => {
    try {
      const response = await apiService.get('/categories/tree');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get popular categories
  getPopularCategories: async (limit = 8) => {
    try {
      const response = await apiService.get('/categories/popular', {
        params: { limit }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default categoryService;
