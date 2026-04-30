import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Pastikan path import ini sesuai dengan struktur foldermu
import logoMascot from '/images/logo-unibites.png';
import iconProfile from '/images/logo-profil.png';

interface NavbarProps {
  // Opsional: Bisa ditambahkan props seperti userName atau fungsi onLogout nanti
}

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

  // Method untuk toggle menu di layar mobile
  private toggleMenu = (): void => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  // Method untuk menutup menu saat link diklik
  private closeMenu = (): void => {
    this.setState({ isMenuOpen: false });
  };

  render() {
    const { isMenuOpen } = this.state;

    return (
      <nav className="bg-[#1B2B65] sticky top-0 z-50 shadow-md w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Bagian Kiri: Logo & Brand */}
            <Link 
              to="/catalog" 
              className="flex items-center gap-4 hover:opacity-90 transition-opacity" 
              onClick={this.closeMenu}
            >
              <img src={logoMascot} alt="UniBites Mascot" className="h-14 w-auto object-contain" />
              <span className="text-white text-2xl font-bold tracking-wide">UniBites</span>
            </Link>

            {/* Icon Hamburger untuk Mobile */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={this.toggleMenu} 
                className="text-white hover:text-gray-300 focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                <span className="text-3xl font-bold">{isMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>

            {/* Bagian Kanan: Menu Navigasi Desktop */}
            <ul className="hidden md:flex md:items-center md:gap-10">
              <li>
                <Link to="/catalog" className="text-white font-semibold text-lg hover:opacity-80 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-white font-semibold text-lg hover:opacity-80 transition-opacity">
                  Pesanan
                </Link>
              </li>
              <li>
                {/* Profile icon dibungkus dalam lingkaran putih */}
                <Link to="/profile" className="flex items-center group">
                  <div className="bg-white rounded-full w-12 h-12 flex justify-center items-center overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                    <img src={iconProfile} alt="User Profile" className="w-8 h-8 object-contain text-[#1B2B65]" />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Menu Navigasi Mobile (Dropdown) */}
        <div 
          className={`md:hidden absolute w-full bg-[#1B2B65] border-t border-white/10 shadow-lg transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'top-20 opacity-100 visible' : 'top-16 opacity-0 invisible pointer-events-none'
          }`}
        >
          <ul className="flex flex-col items-center py-6 gap-6">
            <li className="w-full text-center">
              <Link 
                to="/catalog" 
                className="block text-white font-semibold text-lg hover:bg-white/10 py-2 w-full transition-colors" 
                onClick={this.closeMenu}
              >
                Home
              </Link>
            </li>
            <li className="w-full text-center">
              <Link 
                to="/my-orders" 
                className="block text-white font-semibold text-lg hover:bg-white/10 py-2 w-full transition-colors" 
                onClick={this.closeMenu}
              >
                Pesanan
              </Link>
            </li>
            <li className="w-full flex justify-center pt-2">
              <Link to="/profile" className="flex items-center" onClick={this.closeMenu}>
                <div className="bg-white rounded-full w-14 h-14 flex justify-center items-center overflow-hidden shadow-md">
                  <img src={iconProfile} alt="User Profile" className="w-9 h-9 object-contain" />
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}