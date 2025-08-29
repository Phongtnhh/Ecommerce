import { apiService } from '../../shared/services/api';

export const ProductService = {
  getProducts: async () => apiService.get("/products"),
  getProductByCategory: async (slugCategory) => apiService.get(`/products/${slugCategory}`),
}