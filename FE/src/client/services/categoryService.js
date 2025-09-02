import { apiService } from '../../shared/services/api';
export const CategoryService = {
  getCategory: () => apiService.get("/category"),
  getCategorybyId: (id) => apiService.get(`/category/${id}`),

}

export default CategoryService;
