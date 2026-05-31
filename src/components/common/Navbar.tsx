import { Component } from "react";
import { Link, NavLink } from "react-router-dom";

import logoMascot from "/images/logo-navbar.png";
import iconProfile from "/images/logo-profil.png";

interface NavbarProps {}

interface NavbarState {
  isMenuOpen: boolean;
}

export class Navbar extends Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
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
    `font-semibold text-lg tracking-wide transition-all duration-200 ${
      isActive
        ? "text-[#FFD13B] border-b-2 border-[#FFD13B] pb-1"
        : "text-white hover:text-gray-300"
    }`;

  private getMobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `block text-center font-semibold text-lg py-3 w-full transition-colors duration-200 ${
      isActive ? "text-[#FFD13B] bg-white/10" : "text-white hover:bg-white/10"
    }`;

  render() {
    const { isMenuOpen } = this.state;

    return (
      <nav className="bg-[#102A71] sticky top-0 z-50 w-full shadow-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              to="/home"
              className="flex items-center gap-4 hover:opacity-90 transition-opacity focus:outline-none"
              onClick={this.closeMenu}
            >
              <img
                src={logoMascot}
                alt="UniBites Mascot"
                className="h-14 w-auto object-contain"
              />
              <span className="text-white text-2xl font-bold tracking-wide">
                UniBites
              </span>
            </Link>

            <div className="md:hidden flex items-center">
              <button
                onClick={this.toggleMenu}
                className="text-white hover:text-[#FFD13B] focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                <span className="text-3xl font-bold">
                  {isMenuOpen ? "✕" : "☰"}
                </span>
              </button>
            </div>

            <ul className="hidden md:flex md:items-center md:gap-10">
              <li>
                <NavLink to="/home" className={this.getNavClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-orders" className={this.getNavClass}>
                  Pesanan
                </NavLink>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="flex items-center group focus:outline-none"
                >
                  <div className="bg-white rounded-full w-12 h-12 flex justify-center items-center overflow-hidden shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                    <img
                      src={iconProfile}
                      alt="User Profile"
                      className="w-8 h-8 object-contain text-[#1B2B65]"
                    />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`md:hidden absolute w-full bg-[#1B2B65] border-t border-white/10 shadow-xl transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "top-20 opacity-100 visible"
              : "top-16 opacity-0 invisible pointer-events-none"
          }`}
        >
          <ul className="flex flex-col items-center py-4 gap-2">
            <li className="w-full">
              <NavLink
                to="/home"
                className={this.getMobileNavClass}
                onClick={this.closeMenu}
              >
                Home
              </NavLink>
            </li>
            <li className="w-full">
              <NavLink
                to="/my-orders"
                className={this.getMobileNavClass}
                onClick={this.closeMenu}
              >
                Pesanan
              </NavLink>
            </li>
            <li className="w-full flex justify-center pt-4 pb-2 border-t border-white/10 mt-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full transition-colors"
                onClick={this.closeMenu}
              >
                <div className="bg-white rounded-full w-10 h-10 flex justify-center items-center overflow-hidden shadow-md">
                  <img
                    src={iconProfile}
                    alt="User Profile"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <span className="text-white font-medium">Profil Saya</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
