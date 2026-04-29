import { UserRole } from "./enums";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}
