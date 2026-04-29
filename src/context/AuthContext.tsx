import React, { createContext, Component } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { User, AuthToken } from "../domain/User";
import { AuthService } from "../services/AuthService";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginAction: (authData: AuthToken) => Promise<void>;
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

export class AuthProvider extends Component<
  AuthProviderProps,
  AuthProviderState
> {
  private authService: AuthService;

  constructor(props: AuthProviderProps) {
    super(props);
    this.state = {
      user: null,
      token: null,
      isAuthenticated: false,
      isInitializing: true,
    };
    this.authService = new AuthService();
  }

  componentDidMount() {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      this.restoreSession(storedToken);
    } else {
      this.setState({ isInitializing: false });
    }
  }

  restoreSession = async (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        console.warn("Token expired, logging out...");
        this.logoutAction();
        return;
      }

      localStorage.setItem("access_token", token);

      const user = await this.authService.getMe();

      this.setState({
        token: token,
        user: user,
        isAuthenticated: true,
        isInitializing: false,
      });
    } catch (error) {
      console.error("Sesi tidak valid atau user diblokir:", error);
      this.logoutAction();
    }
  };

  loginAction = async (authData: AuthToken) => {
    await this.restoreSession(authData.access_token);
  };

  logoutAction = () => {
    localStorage.removeItem("access_token");
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitializing: false,
    });
  };

  render() {
    if (this.state.isInitializing) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          Memuat sesi UniBites...
        </div>
      );
    }

    const value: AuthContextType = {
      user: this.state.user,
      token: this.state.token,
      isAuthenticated: this.state.isAuthenticated,
      loginAction: this.loginAction,
      logoutAction: this.logoutAction,
    };

    return (
      <AuthContext.Provider value={value}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
