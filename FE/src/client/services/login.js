import { apiService } from "../../shared/services/api"; 

export const LoginService = {
    login: (data) => apiService.post("/auth/login", data),
}