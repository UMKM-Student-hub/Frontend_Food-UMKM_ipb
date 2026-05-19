import { ApiService } from "./ApiService";
import type { User, AuthToken, LoginRequest, RegisterRequest } from "../domain/User";

export class AuthService extends ApiService {
  async register(payload: RegisterRequest): Promise<User> {
    return this.post<User>("/auth/register", payload);
  }

  async login(payload: LoginRequest): Promise<AuthToken> {
    return this.post<AuthToken>("/auth/login", payload);
  }

  async getMe(): Promise<User> {
    return this.get<User>("/auth/me");
  }

  async updateMe(payload: { name?: string; phone?: string }): Promise<User> {
    return this.patch<User>("/auth/me", payload);
  }

  setToken(token: string): void {
    localStorage.setItem("access_token", token);
  }

  clearAuth(): void {
    localStorage.removeItem("access_token");
  }
}