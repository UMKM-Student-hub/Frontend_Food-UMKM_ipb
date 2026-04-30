import React, { Component } from "react";
import { Link } from "react-router-dom";
import { UserRole } from "../../domain/enums";

interface NavbarState {
  isMobileMenuOpen: boolean;
}

class Navbar extends Component<{}, NavbarState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isMobileMenuOpen: false,
    };
  }

  toggleMobileMenu = () => {
    this.setState((prevState) => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
    }));
  };

  render() {
    const mockAuth = {
      isAuthenticated: false,
      user: { name: "Mahasiswa IPB", role: UserRole.BUYER },
    };

    const { isAuthenticated, user } = mockAuth;
    const { isMobileMenuOpen } = this.state;

    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  to="/"
                  className="text-2xl font-bold text-green-700 tracking-tight"
                >
                  UniBites
                </Link>
              </div>

              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link
                  to="/catalog"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-green-600 hover:text-gray-900 transition-colors"
                >
                  Katalog UMKM
                </Link>
                <Link
                  to="/deals"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-green-600 hover:text-gray-900 transition-colors"
                >
                  Promo & Deals
                </Link>
                {isAuthenticated && user?.role === UserRole.BUYER && (
                  <Link
                    to="/my-orders"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-green-600 hover:text-gray-900 transition-colors"
                  >
                    Pesanan Saya
                  </Link>
                )}
                {isAuthenticated && user?.role === UserRole.SELLER && (
                  <Link
                    to="/seller"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-green-600 hover:text-gray-900 transition-colors"
                  >
                    Dashboard Toko
                  </Link>
                )}
              </div>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {!isAuthenticated ? (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md transition-colors shadow-sm"
                  >
                    Daftar
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Halo, {user?.name}
                  </span>
                  <button className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 border border-red-200 rounded-md hover:bg-red-50 transition-colors">
                    Logout
                  </button>
                </div>
              )}
            </div>

            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={this.toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Buka menu utama</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/catalog"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-green-600 hover:text-gray-900"
              >
                Katalog UMKM
              </Link>
              <Link
                to="/deals"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-green-600 hover:text-gray-900"
              >
                Promo & Deals
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-green-600 hover:bg-green-50"
                >
                  Masuk / Daftar
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }
}

export default Navbar;
