import React, { createContext, Component } from "react";
import type { ReactNode, ContextType } from "react";
import { jwtDecode } from "jwt-decode";
import type { User } from "../domain/User";
import { AuthService } from "../services/AuthService";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  loginAction: (token: string) => Promise<void>;
  logoutAction: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthProviderState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

interface DecodedJwtPayload {
  exp?: number;
  sub?: string;
  role?: string;
}

export class AuthProvider extends Component<
  AuthProviderProps,
  AuthProviderState
> {
  private authService = new AuthService();

  state: AuthProviderState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isInitializing: true,
  };

  async componentDidMount() {
    const token = localStorage.getItem("access_token");
    if (token) {
      await this.restoreSession(token);
    } else {
      this.setState({ isInitializing: false });
    }
  }

  private restoreSession = async (token: string): Promise<void> => {
    try {
      const decoded = jwtDecode<DecodedJwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        this.logoutAction();
        return;
      }

      this.authService.setToken(token);
      const user = await this.authService.getMe();

      this.setState({
        token,
        user,
        isAuthenticated: true,
        isInitializing: false,
      });
    } catch (error) {
      this.logoutAction();
    }
  };

  loginAction = async (token: string): Promise<void> => {
    this.setState({ isInitializing: true });
    await this.restoreSession(token);
  };

  logoutAction = (): void => {
    this.authService.clearAuth();
    localStorage.removeItem("user_role");
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitializing: false,
    });
  };

  render() {
    const { user, token, isAuthenticated, isInitializing } = this.state;

    const contextValue: AuthContextType = {
      user,
      token,
      isAuthenticated,
      isInitializing,
      loginAction: this.loginAction,
      logoutAction: this.logoutAction,
    };

    if (isInitializing) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50 text-green-700 font-semibold">
          Memuat sesi UniBites...
        </div>
      );
    }

    return (
      <AuthContext.Provider value={contextValue}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
