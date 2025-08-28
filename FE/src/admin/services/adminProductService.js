import { apiService } from '../../shared/services/api';

export const adminProductService = {
  // Get all products for admin (with pagination and filters)
  getProducts: async (params = {}) => {
    try {
      const response = await apiService.get('/admin/products', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single product for admin
  getProductById: async (id) => {
    try {
      const response = await apiService.get(`/admin/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await apiService.post('/admin/products', productData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await apiService.put(`/admin/products/${id}`, productData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await apiService.delete(`/admin/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk delete products
  bulkDeleteProducts: async (productIds) => {
    try {
      const response = await apiService.post('/admin/products/bulk-delete', {
        productIds
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update product status
  updateProductStatus: async (id, status) => {
    try {
      const response = await apiService.patch(`/admin/products/${id}/status`, {
        status
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload product images
  uploadProductImages: async (productId, files, onProgress = null) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await apiService.upload(
        `/admin/products/${productId}/images`,
        formData,
        onProgress
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete product image
  deleteProductImage: async (productId, imageId) => {
    try {
      const response = await apiService.delete(
        `/admin/products/${productId}/images/${imageId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      const response = await apiService.get('/admin/products/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Import products from CSV
  importProducts: async (file, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiService.upload(
        '/admin/products/import',
        formData,
        onProgress
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export products to CSV
  exportProducts: async (params = {}) => {
    try {
      const response = await apiService.download(
        '/admin/products/export',
        'products.csv'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default adminProductService;
