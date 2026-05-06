import React from 'react';
import { useParams } from 'react-router-dom'; 

import type { UMKM } from '../../domain/UMKM';
import type { MenuItem } from '../../domain/MenuItem';
import { ProductCategory } from '../../domain/enums';
import { CategoryFilter } from '../../components/buyer/CategoryFilter';
import { MenuCard } from '../../components/buyer/MenuCard';
import { SearchBar } from '../../components/buyer/SearchKantin';

interface ProductDetailState {
  umkm: UMKM | null;
  menuItems: MenuItem[];
  averageRating: number;
  selectedCategory: string | undefined;
  searchKeyword: string;
  isLoading: boolean;
  isCartModalOpen: boolean;
  cartItems: CartItem[];
  error: string | null;
}

interface ProductDetailProps {
  umkmId: number;
}

class ProductDetailPage extends React.Component<ProductDetailProps, ProductDetailState> {
  constructor(props: ProductDetailProps) {
    super(props);
    this.state = {
      umkm: null,
      menuItems: [],
      averageRating: 0,
      selectedCategory: undefined,
      searchKeyword: "",
      isLoading: true, 
      error: null,
    };
  }

  async componentDidMount() {
    await this.fetchData();
  }

  private handleCategoryChange = (category: string | undefined): void => {
    this.setState({ selectedCategory: category });
  };

  private handleSearchChange = (keyword: string): void => {
    this.setState({ searchKeyword: keyword });
  };

  private toggleCartModal = (): void => {
  this.setState(prevState => ({ isCartModalOpen: !prevState.isCartModalOpen }));
  };

  private async fetchData(): Promise<void> {
    this.setState({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const dummyUMKM: UMKM = {
        id: this.props.umkmId || 1,
        owner_id: 101,
        name: "Nama Kantin",
        description: "We consider all the drivers of change gives you the components you need to change to create a truly happens.",
        location: "Alamat kantin, Kantin Fakultas Apa",
        is_open: true,
        created_at: new Date().toISOString(),
      };

      const dummyMenuItems: MenuItem[] = [
        { id: 1, umkm_id: 1, name: "Fried Eggs", description: "Made with eggs, lettuce, salt, oil and other ingredients.", price: 15000, stock: 10, photo_url: "/images/makanan.png", category: ProductCategory.MAKANAN, is_active: true },
        { id: 2, umkm_id: 1, name: "Es Teh Manis", description: "Segar dan manis, pas untuk menemani praktikum.", price: 5000, stock: 50, photo_url: null, category: ProductCategory.MINUMAN, is_active: true },
        { id: 3, umkm_id: 1, name: "Cireng Garing", description: "Jajanan gurih dengan bumbu rujak pedas mantap.", price: 10000, stock: 20, photo_url: null, category: ProductCategory.JAJANAN, is_active: true },
        { id: 4, umkm_id: 1, name: "Ayam Penyet", description: "Ayam goreng bumbu kuning dengan sambal penyet hot.", price: 18000, stock: 15, photo_url: "/images/makanan.png", category: ProductCategory.MAKANAN, is_active: true }
      ];

      this.setState({ 
        umkm: dummyUMKM, 
        menuItems: dummyMenuItems,
        averageRating: 4.5 
      });
    } catch (err: any) {
      this.setState({ error: 'Gagal memuat data menu.' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { umkm, menuItems, selectedCategory, searchKeyword, isLoading } = this.state;
    
    const { isCartModalOpen, cartItems } = this.state;

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const filteredMenu = menuItems.filter(item => {
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesSearch = item.name.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="w-full bg-[#F8F9FA] min-h-screen font-sans">
        
        {/* --- HERO SECTION: Sesuai Layout Gambar --- */}
        <div className="bg-white px-16 pt-12 pb-8 border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex justify-between items-start">
            
            {/* Sisi Kiri: Nama, Alamat, Deskripsi, Search, Filter */}
            <div className="flex-1 pr-12">
              <h1 className="text-6xl font-bold text-[#1E3A8A]">
                {umkm?.name || "Nama Kantin"}
              </h1>
              <p className="text-2xl text-[#1E3A8A] font-bold mt-2">
                {umkm?.location || "Alamat kantin..."}
              </p>
              <p className="text-gray-500 mt-4 text-lg max-w-2xl leading-relaxed">
                {umkm?.description}
              </p>

              {/* Integrasi Search Bar Baru */}
              <div className="mt-8">
                <SearchBar 
                  value={searchKeyword} 
                  onChange={this.handleSearchChange} 
                />
              </div>

              {/* Integrasi Category Filter */}
              <div className="mt-4">
                <CategoryFilter 
                  selectedCategory={selectedCategory} 
                  onCategoryChange={this.handleCategoryChange} 
                />
              </div>
            </div>

            {/* Sisi Kanan: Rating */}
            <div className="text-right pt-4 shrink-0">
              <div className="flex items-center justify-end text-7xl font-bold text-[#1E3A8A]">
                {this.state.averageRating.toLocaleString('id-ID')}/5
                <span className="ml-3 text-5xl">✨</span>
              </div>
              <p className="text-3xl text-gray-400 mt-1 font-medium">Ulasan</p>
            </div>

            <FloatingCartButton 
              totalItems={totalItems} 
              onClick={this.toggleCartModal} 
            />

          </div>
        </div>

        {/* --- GRID MENU: Background Abu-abu Terang ---[cite: 1] */}
        <div className="max-w-7xl mx-auto px-16 py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 text-center">
               <p className="col-span-full text-[#FBBF24] font-bold animate-pulse">Menyiapkan menu terbaik...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {filteredMenu.map((item) => (
                <MenuCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={(i, q) => alert(`🛒 ${q}x ${i.name} ditambahkan!`)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export const ProductDetailPageWrapper = () => {
  const params = useParams();
  return <ProductDetailPage umkmId={Number(params.umkmId)} />;
};

export { ProductDetailPage };