import { Component } from "react";
import type { ReactNode, ContextType } from "react"; // Gunakan import type
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../context/AuthContext"; // Gunakan import type
import { UserRole } from "../domain/enums";

interface GuardProps {
  children: ReactNode;
}

export class SellerGuard extends Component<GuardProps> {
  static contextType = AuthContext;
  declare context: ContextType<typeof AuthContext>;

  render() {
    const { isAuthenticated, user } = this.context as AuthContextType;

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (user?.role !== UserRole.SELLER) {
      return <Navigate to="/catalog" replace />;
    }

    return <>{this.props.children}</>;
  }
}
