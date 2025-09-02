import { apiService } from '../../shared/services/api';

export const SearchService = {
  // Search products with keyword
  searchProducts: async (keyword) => {
    try {
      const response = await apiService.get("/search", { 
        params: { keyword } 
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get search suggestions (can be enhanced with dedicated API)
  getSearchSuggestions: async (keyword) => {
    try {
      if (!keyword || keyword.length < 2) return { products: [] };
      
      const response = await apiService.get("/search", { 
        params: { keyword } 
      });
      
      // Return first 5 products as suggestions
      return {
        ...response,
        products: response.products?.slice(0, 5) || []
      };
    } catch (error) {
      throw error;
    }
  }
};

export default SearchService;
