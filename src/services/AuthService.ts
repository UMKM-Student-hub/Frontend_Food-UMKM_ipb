import { ApiService } from "./ApiService";
import type { User, AuthToken, RegisterRequest } from "../domain/User";

export class AuthService extends ApiService {
  /**
   * US-A01: Mendaftarkan akun baru.
   */
  async register(payload: RegisterRequest): Promise<User> {
    return this.post<User>("/auth/register", payload);
  }

  /**
   * US-A02: Masuk dan mendapatkan JWT.
   */
  async login(email: string, password: string): Promise<AuthToken> {
    const payload = {
      email: email,
      password: password,
    };
    return this.post<AuthToken>("/auth/login", payload);
  }

  /**
   * Mengambil profil pengguna yang sedang login dari Backend.
   */
  async getMe(): Promise<User> {
    return this.get<User>("/auth/me");
  }
}
