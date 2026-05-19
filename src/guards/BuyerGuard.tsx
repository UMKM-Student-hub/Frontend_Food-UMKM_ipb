import { Component } from "react";
import type { ReactNode, ContextType } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../context/AuthContext";
import { UserRole } from "../domain/enums";

interface GuardProps {
  children: ReactNode;
}

export class BuyerGuard extends Component<GuardProps> {
  static contextType = AuthContext;
  declare context: ContextType<typeof AuthContext>;

  render() {
    const { isAuthenticated, user } = this.context as AuthContextType;

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (user && user.role !== UserRole.BUYER) {
      return <Navigate to="/login" replace />;
    }

    return <>{this.props.children}</>;
  }
}
