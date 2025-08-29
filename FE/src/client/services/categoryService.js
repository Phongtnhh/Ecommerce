import { apiService } from '../../shared/services/api';
export const CategoryService = {
  getCategory: () => apiService.get("/category"),

}

export default CategoryService;
