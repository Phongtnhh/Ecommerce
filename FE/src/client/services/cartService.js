import { apiService } from '../../shared/services/api';

export const CartService = {
  getCart: async () => apiService.get("/cart"),
  postCart: async (data) => apiService.post("/cart/add", data),
  updateQuantity: async (data) => apiService.patch("/cart/update-quantity", data),
  removeItem: async (data) => apiService.delete("/cart/delete", { data }),
}