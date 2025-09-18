import { api, endpoints } from "@/lib/api-client";
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from "@/lib/types/api";

export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      endpoints.auth.login,
      credentials,
    );
    return response.data;
  },

  // Signup user
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      endpoints.auth.signup,
      userData,
    );
    return response.data;
  },

  // Get current user (when backend implements /auth/me)
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(endpoints.auth.me);
    return response.data;
  },

  // Helper function to check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  // Helper function to get user role from token
  getRoleFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || null;
    } catch (error) {
      return null;
    }
  },
};
