import React, { Component } from 'react';
import { ProductCategory } from '../../domain/enums'; //[cite: 2]

interface MenuFilterBarProps {
  activeCategory: ProductCategory | 'SEMUA';
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  onCategoryChange: (category: ProductCategory | 'SEMUA') => void;
}

interface MenuFilterBarState {
  localKeyword: string;
}

export class MenuFilterBar extends Component<MenuFilterBarProps, MenuFilterBarState> {
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(props: MenuFilterBarProps) {
    super(props);
    // State lokal agar UI input merespons ketikan seketika tanpa delay dari Parent
    this.state = {
      localKeyword: props.searchKeyword,
    };
  }

  // Sinkronisasi jika parent mereset keyword (misal dari fitur "Clear Filter")
  componentDidUpdate(prevProps: MenuFilterBarProps) {
    if (prevProps.searchKeyword !== this.props.searchKeyword && this.props.searchKeyword !== this.state.localKeyword) {
      this.setState({ localKeyword: this.props.searchKeyword });
    }
  }

  componentWillUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  // Handle input dengan teknik Debounce (Tunda eksekusi API selama 300ms)
  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    this.setState({ localKeyword: value });

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.props.onSearchChange(value);
    }, 300);
  };

  private handleCategoryClick = (category: ProductCategory | 'SEMUA'): void => {
    // Hindari pemanggilan fungsi jika kategori yang diklik sudah aktif
    if (this.props.activeCategory !== category) {
      this.props.onCategoryChange(category);
    }
  };

  render() {
    const { activeCategory } = this.props;
    const { localKeyword } = this.state;

    // Mapping kategori untuk tombol sesuai enum dan mockup[cite: 2]
    const categories: Array<{ id: ProductCategory | 'SEMUA'; label: string }> = [
      { id: 'SEMUA', label: 'Semua' },
      { id: ProductCategory.MAKANAN, label: 'Makanan' },
      { id: ProductCategory.MINUMAN, label: 'Minuman' },
      { id: ProductCategory.JAJANAN, label: 'Jajanan' },
    ];

    return (
      <div className="flex flex-col gap-5 w-full bg-white py-4">
        
        {/* Search Bar */}
        <div className="relative w-full">
          {/* Ikon Kaca Pembesar (SVG murni) */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            type="text"
            value={localKeyword}
            onChange={this.handleInputChange}
            placeholder="Cari menu favoritmu di sini.."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 border-[#fca311] rounded-2xl text-slate-700 text-[15px] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#fca311]/20 transition-all shadow-sm"
          />
        </div>

        {/* Kategori Filter (Scrollable di Mobile) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar w-full">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => this.handleCategoryClick(cat.id)}
                className={`
                  whitespace-nowrap px-6 py-2.5 rounded-xl font-semibold text-[15px] border-2 transition-all duration-200 active:scale-95 focus:outline-none
                  ${isActive 
                    ? 'bg-[#fca311] border-[#fca311] text-[#14213d] shadow-md' // Active state (Kuning pekat)
                    : 'bg-white border-[#fca311] text-[#14213d] hover:bg-[#fca311]/10' // Inactive state (Outline kuning)
                  }
                `}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}