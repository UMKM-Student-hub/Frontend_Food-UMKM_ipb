import { Component } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";

import iconProfile from "/images/logo-profil.png";

interface SellerLayoutProps {}

interface SellerLayoutState {
  isMenuOpen: boolean;
}

export default class SellerLayout extends Component<
  SellerLayoutProps,
  SellerLayoutState
> {
  constructor(props: SellerLayoutProps) {
    super(props);
    this.state = {
      isMenuOpen: false,
    };
  }

  private toggleMenu = (): void => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  private closeMenu = (): void => {
    this.setState({ isMenuOpen: false });
  };

  private getNavClass = ({ isActive }: { isActive: boolean }) =>
    `font-semibold tracking-wide transition-colors duration-200 ${
      isActive
        ? "text-[#FFD13B] border-b-2 border-[#FFD13B] pb-1"
        : "text-white hover:text-gray-300"
    }`;

  private getMobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `text-xl font-semibold tracking-wide transition-colors duration-200 ${
      isActive ? "text-[#FFD13B]" : "text-white hover:text-gray-300"
    }`;

  render() {
    const { isMenuOpen } = this.state;

    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <nav className="bg-[#1B2B65] sticky top-0 z-50 shadow-md w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link
                to="/seller"
                className="flex items-center gap-4 hover:opacity-90 transition-opacity"
                onClick={this.closeMenu}
              >
                <img
                  src="/images/logo-navbar.png"
                  alt="UniBites Mascot"
                  className="h-14 w-auto object-contain"
                />
                <span className="text-white text-2xl font-bold tracking-wide">
                  UniBites
                </span>
              </Link>

              {/* Tengah: Menu Navigasi (Desktop) */}
              <ul className="hidden md:flex md:items-center gap-8 ml-auto mr-10">
                <li>
                  {/* Gunakan 'end' agar /seller tidak terus-terusan aktif saat membuka /seller/orders */}
                  <NavLink to="/seller" end className={this.getNavClass}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/seller/orders" className={this.getNavClass}>
                    Pesanan
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/seller/products" className={this.getNavClass}>
                    Menu
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/seller/promos" className={this.getNavClass}>
                    Promo
                  </NavLink>
                </li>
              </ul>

              {/* Hamburger Icon (Mobile) */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={this.toggleMenu}
                  className="text-white hover:text-gray-300 focus:outline-none transition-colors"
                >
                  <span className="text-3xl font-bold">
                    {isMenuOpen ? "✕" : "☰"}
                  </span>
                </button>
              </div>

              {/* Kanan: Profile Icon (Desktop) */}
              <div className="hidden md:flex md:items-center">
                <Link to="/seller/profile" className="flex items-center group">
                  <div className="bg-white rounded-full w-12 h-12 flex justify-center items-center overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={iconProfile}
                      alt="Seller Profile"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Menu Mobile Dropdown */}
          <div
            className={`md:hidden absolute w-full bg-[#1B2B65] border-t border-white/10 shadow-lg transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "top-20 opacity-100 visible"
                : "top-16 opacity-0 invisible pointer-events-none"
            }`}
          >
            <ul className="flex flex-col items-center py-8 gap-6">
              <li>
                <NavLink
                  to="/seller"
                  end
                  className={this.getMobileNavClass}
                  onClick={this.closeMenu}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/seller/orders"
                  className={this.getMobileNavClass}
                  onClick={this.closeMenu}
                >
                  Pesanan
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/seller/products"
                  className={this.getMobileNavClass}
                  onClick={this.closeMenu}
                >
                  Menu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/seller/promos"
                  className={this.getMobileNavClass}
                  onClick={this.closeMenu}
                >
                  Promo
                </NavLink>
              </li>
              <li className="w-full flex justify-center pt-6 border-t border-white/10 mt-2">
                <Link
                  to="/seller/profile"
                  className="flex items-center gap-3"
                  onClick={this.closeMenu}
                >
                  <div className="bg-white rounded-full w-12 h-12 flex justify-center items-center overflow-hidden shadow-md">
                    <img
                      src={iconProfile}
                      alt="Seller Profile"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="text-white font-medium">Profil Kantin</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Konten Halaman Admin - Di-render di dalam tag main ini */}
        <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    );
  }
}
