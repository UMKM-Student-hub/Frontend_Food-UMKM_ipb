import { Component, Suspense } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { UMKMService } from "../services/UMKMService";
import iconProfile from "/images/logo-profil.png";

interface SellerLayoutProps {}

interface SellerLayoutState {
  isMenuOpen: boolean;
  storeName: string | null;
}

export default class SellerLayout extends Component<
  SellerLayoutProps,
  SellerLayoutState
> {
  private umkmService = new UMKMService();

  constructor(props: SellerLayoutProps) {
    super(props);
    this.state = {
      isMenuOpen: false,
      storeName: null,
    };
  }

  async componentDidMount() {
    try {
      const umkm = await (this.umkmService as any).getMyProfile();
      if (umkm && umkm.name) {
        this.setState({ storeName: umkm.name });
      }
    } catch (error) {
      console.warn(error);
    }
  }

  private toggleMenu = (): void => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  private closeMenu = (): void => {
    this.setState({ isMenuOpen: false });
  };

  private getNavClass = ({ isActive }: { isActive: boolean }) =>
    `font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap ${
      isActive
        ? "text-[#FFD13B] border-b-2 border-[#FFD13B] pb-1"
        : "text-white hover:text-gray-300"
    }`;

  private getMobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `text-xl font-semibold tracking-wide transition-colors duration-200 block w-full text-center py-2 ${
      isActive ? "text-[#FFD13B] bg-white/5" : "text-white hover:bg-white/10"
    }`;

  render() {
    const { isMenuOpen, storeName } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <nav className="bg-[#1B2B65] sticky top-0 z-50 shadow-md w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link
                to="/seller"
                className="flex items-center gap-4 hover:opacity-90 transition-opacity focus:outline-none shrink-0"
                onClick={this.closeMenu}
              >
                <img
                  src="/images/logo-navbar.png"
                  alt="UniBites Mascot"
                  className="h-14 w-auto object-contain"
                />
                <span className="text-white text-2xl font-bold tracking-wide hidden sm:block">
                  UniBites
                </span>
              </Link>

              <ul className="hidden md:flex md:items-center gap-6 lg:gap-8 mx-auto px-4">
                <li>
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
                <li>
                  <NavLink to="/seller/reviews" className={this.getNavClass}>
                    Ulasan
                  </NavLink>
                </li>
              </ul>

              <div className="md:hidden flex items-center">
                <button
                  onClick={this.toggleMenu}
                  className="text-white hover:text-[#FFD13B] focus:outline-none transition-colors"
                >
                  <span className="text-3xl font-bold">
                    {isMenuOpen ? "✕" : "☰"}
                  </span>
                </button>
              </div>

              <div className="hidden md:flex md:items-center gap-4 border-l border-white/20 pl-6 shrink-0">
                {storeName && (
                  <span className="text-white font-medium text-sm hidden lg:block text-right">
                    Halo, <br />
                    <strong className="text-[#FFD13B] truncate max-w-30 inline-block">
                      {storeName}
                    </strong>
                  </span>
                )}
                <Link
                  to="/seller/profile"
                  className="flex items-center group focus:outline-none"
                >
                  <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center overflow-hidden shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                    <img
                      src={iconProfile}
                      alt="Seller Profile"
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div
            className={`md:hidden absolute w-full bg-[#1B2B65] border-t border-white/10 shadow-xl transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "top-20 opacity-100 visible"
                : "top-16 opacity-0 invisible pointer-events-none"
            }`}
          >
            <ul className="flex flex-col items-center py-6 gap-2">
              <li className="w-full">
                <NavLink
                  to="/seller"
                  end
                  className={this.getMobileNavClass}
                  onClick={this.closeMenu}
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="w-full">
                <NavLink
                  to="/seller/orders"
                  className={this.getMobileNavClass}
                  onClick={this.closeMenu}
                >
                  Pesanan
                </NavLink>
              </li>
              <li className="w-full">
                <NavLink
                  to="/seller/products"
                  className={this.getMobileNavClass}
                  onClick={this.closeMenu}
                >
                  Menu
                </NavLink>
              </li>
              <li className="w-full">
                <NavLink
                  to="/seller/promos"
                  className={this.getMobileNavClass}
                  onClick={this.closeMenu}
                >
                  Promo
                </NavLink>
              </li>
              <li className="w-full">
                <NavLink
                  to="/seller/reviews"
                  className={this.getMobileNavClass}
                  onClick={this.closeMenu}
                >
                  Ulasan
                </NavLink>
              </li>
              <li className="w-full flex justify-center pt-6 border-t border-white/10 mt-2">
                <Link
                  to="/seller/profile"
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full transition-colors"
                  onClick={this.closeMenu}
                >
                  <div className="bg-white rounded-full w-10 h-10 flex justify-center items-center overflow-hidden shadow-md">
                    <img
                      src={iconProfile}
                      alt="Seller Profile"
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <span className="text-white font-medium">
                    {storeName ? storeName : "Profil Kantin"}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
          <Suspense
            fallback={
              <div className="flex flex-col justify-center items-center h-[60vh] w-full">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-[#1B2B65]"></div>
                <p className="mt-4 text-[#1B2B65] font-bold animate-pulse tracking-wide">
                  Membuka Dasbor...
                </p>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    );
  }
}