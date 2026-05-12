import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import type { UMKM } from '../../domain/UMKM';
import type { MenuItem } from '../../domain/MenuItem';
import { CatalogService } from '../../services/CatalogService';

// ==========================================
// 1. COMPONENT: UMKMCatalogCard (Child)
// ==========================================
interface UMKMCardProps {
  umkm: UMKM;
}

interface UMKMCardState {
  menus: MenuItem[];
  isLoading: boolean;
}

export class UMKMCatalogCard extends Component<UMKMCardProps, UMKMCardState> {
  private catalogService = new CatalogService();
  private scrollRef = createRef<HTMLDivElement>();

  constructor(props: UMKMCardProps) {
    super(props);
    this.state = {
      menus: [],
      isLoading: true,
    };
  }

  async componentDidMount() {
    try {
      const menus = await this.catalogService.getUMKMMenu(this.props.umkm.id);
      this.setState({ menus, isLoading: false });
    } catch (error) {
      console.error("Gagal memuat menu UMKM", error);
      this.setState({ isLoading: false });
    }
  }

  // Mencegah klik tombol panah agar tidak melempar user ke halaman detail kantin
  private scrollRight = (e: React.MouseEvent): void => {
    e.preventDefault(); 
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  render() {
    const { umkm } = this.props;
    const { menus, isLoading } = this.state;
    const fallbackImage = "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400";

    return (
      // Seluruh area Card sekarang dibungkus Link agar bisa diklik
      <Link 
        to={`/catalog/${umkm.id}`}
        className="block bg-white border-2 border-[#FFCF00] rounded-2xl p-5 md:p-6 mb-6 shadow-sm w-full cursor-pointer hover:shadow-lg transition-shadow duration-300 relative"
      >
        {/* Header Card: Info Kantin & Rating */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-[#1B2B65] font-bold text-2xl mb-1">{umkm.name}</h2>
            <p className="text-[#1B2B65] text-base opacity-80">{umkm.location}</p>
          </div>
          <div className="text-right">
            <div className="text-[#1B2B65] font-bold text-xl flex items-center gap-1 justify-end">
              4,5/5 <span className="text-yellow-400">✨</span>
            </div>
            <div className="text-[#1B2B65] text-sm opacity-80">Ulasan</div>
          </div>
        </div>

        {/* Body Card: Horizontal Menu Carousel */}
        <div className="relative group mt-6">
          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-gray-500">Memuat menu...</div>
          ) : menus.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-gray-500">Belum ada menu.</div>
          ) : (
            <div 
              ref={this.scrollRef} 
              className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth hide-scrollbar pb-2"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {menus.map((menu) => (
                <div key={menu.id} className="flex-shrink-0 w-36 md:w-44 flex flex-col hover:opacity-90 transition-opacity">
                  <img 
                    src={menu.photo_url || fallbackImage} 
                    alt={menu.name} 
                    className="w-full h-24 md:h-28 object-cover rounded-xl mb-3 shadow-sm"
                  />
                  <h3 className="text-[#1B2B65] font-bold text-sm md:text-base mb-1 truncate">
                    {menu.name}
                  </h3>
                  <div className="bg-[#FDECE2] text-[#C05020] text-xs md:text-sm font-bold px-2 py-1 rounded w-fit">
                    {menu.price.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tombol Arrow Kanan */}
          {menus.length > 3 && (
            <button 
              onClick={this.scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-[#FFA800] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-[#e69700] transition-colors z-10"
              aria-label="Scroll right"
            >
              <span className="text-xl font-bold">›</span>
            </button>
          )}
        </div>
      </Link>
    );
  }
}

// ==========================================
// 2. COMPONENT: CatalogDashboard (Parent)
// ==========================================
interface CatalogDashboardState {
  umkms: UMKM[];
  activeFilter: string;
  isLoading: boolean;
}

export class CatalogDashboard extends Component<{}, CatalogDashboardState> {
  private catalogService = new CatalogService();

  constructor(props: {}) {
    super(props);
    this.state = {
      umkms: [],
      activeFilter: 'Semua',
      isLoading: true,
    };
  }

  async componentDidMount() {
    try {
      const umkms = await this.catalogService.listAllUMKM();
      this.setState({ umkms, isLoading: false });
    } catch (error) {
      console.error("Gagal memuat daftar Kantin", error);
      this.setState({ isLoading: false });
    }
  }

  private setFilter = (filter: string): void => {
    this.setState({ activeFilter: filter });
  };

  render() {
    const { umkms, activeFilter, isLoading } = this.state;
    const filters = ['Semua', 'Makanan', 'Minuman', 'Jajanan'];

    return (
      <section className="bg-[#FFFCF5] min-h-screen w-full py-10">
        <div className="max-w-7xl mx-auto px-16 lg:px-16">
          
          <h1 className="text-3xl md:text-4xl font-bold text-[#1B2B65] mb-6">
            Jajan dari Kantin Favoritmu Hari Ini!
          </h1>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-8">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => this.setFilter(f)}
                className={`px-5 py-2 rounded-full font-semibold text-sm md:text-base border-2 transition-colors ${
                  activeFilter === f 
                    ? 'bg-[#FFCF00] border-[#FFCF00] text-[#1B2B65]' 
                    : 'bg-transparent border-[#FFCF00] text-[#1B2B65] hover:bg-[#FFCF00]/20'
                }`}
              >
                {f}
              </button>
            ))}

            <button className="px-5 py-2 rounded-full font-semibold text-sm md:text-base bg-transparent border-2 border-[#FFCF00] text-[#1B2B65] hover:bg-[#FFCF00]/20 flex items-center gap-2">
              Kantin Fakultas 
              <span className="text-xs">▼</span>
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500 font-semibold">Memuat Kantin Favoritmu...</div>
          ) : (
            <div className="flex flex-col gap-2">
              {umkms.map((umkm) => (
                <UMKMCatalogCard key={umkm.id} umkm={umkm} />
              ))}
            </div>
          )}

          {!isLoading && umkms.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button className="bg-[#FFA800] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-[#e69700] transition-colors">
                <span className="text-2xl font-bold">‹</span>
              </button>
              <button className="bg-[#FFA800] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-[#e69700] transition-colors">
                <span className="text-2xl font-bold">›</span>
              </button>
            </div>
          )}

        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}} />
      </section>
    );
  }
}

export default CatalogDashboard;