import React, { Component } from 'react';
import { CatalogService } from '../../services/CatalogService';
import type { UMKM } from '../../domain/UMKM';
import type { MenuItem } from '../../domain/MenuItem';
import { ProductCategory } from '../../domain/enums';
import { withRouter } from '../../utils/withRouter';
import { UMKMProfileHeader } from '../../components/buyer/UMKMProfileHeader';
import { MenuFilterBar } from '../../components/buyer/MenuFilterBar';
import { MenuItemCard } from '../../components/buyer/MenuItemCard';
import { DetailProduk } from '../../components/buyer/DetailProduk';
import { DetailKeranjang } from '../../components/buyer/DetailKeranjang';
import type { CartItem } from '../../components/buyer/DetailKeranjang';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorBanner } from '../../components/common/ErrorBanner';

interface RouterProps {
  params: { umkmId?: string };
  navigate: (path: string) => void;
}

interface ProductDetailState {
  umkm: UMKM | null;
  menuItems: MenuItem[];
  filteredItems: MenuItem[];
  averageRating: number | null;
  isLoading: boolean;
  error: string | null;
  searchKeyword: string;
  activeCategory: ProductCategory | 'SEMUA';
  // State Keranjang
  cartItems: CartItem[];
  // State Modal
  selectedProduct: MenuItem | null;
  isDetailProdukOpen: boolean;
  isDetailKeranjangOpen: boolean;
}

class ProductDetailPage extends Component<RouterProps, ProductDetailState> {
  private catalogService = new CatalogService();

  constructor(props: RouterProps) {
    super(props);
    this.state = {
      umkm: null,
      menuItems: [],
      filteredItems: [],
      averageRating: null,
      isLoading: true,
      error: null,
      searchKeyword: '',
      activeCategory: 'SEMUA',
      cartItems: [],
      selectedProduct: null,
      isDetailProdukOpen: false,
      isDetailKeranjangOpen: false,
    };
  }

  async componentDidMount() {
    await this.fetchPageData();
  }

  private fetchPageData = async (): Promise<void> => {
    const { umkmId } = this.props.params;

    if (!umkmId || isNaN(Number(umkmId))) {
      this.setState({ error: 'ID Kantin tidak valid atau tidak ditemukan.', isLoading: false });
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const id = Number(umkmId);
      const [umkmData, menuData] = await Promise.all([
        this.catalogService.getUMKMProfile(id),
        this.catalogService.getUMKMMenu(id),
      ]);

      this.setState({
        umkm: umkmData,
        menuItems: menuData,
        filteredItems: menuData,
        averageRating: 4.5,
      });
    } catch (err: any) {
      this.setState({ error: err.message || 'Gagal memuat data dari server UniBites.' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // ─── Filter ───────────────────────────────────────────────────────────────

  private handleSearchChange = (keyword: string): void => {
    this.setState({ searchKeyword: keyword }, this.applyFilters);
  };

  private handleCategoryChange = (category: ProductCategory | 'SEMUA'): void => {
    this.setState({ activeCategory: category }, this.applyFilters);
  };

  private applyFilters = (): void => {
    const { menuItems, searchKeyword, activeCategory } = this.state;
    const kw = searchKeyword.toLowerCase();

    const filtered = menuItems.filter((item) => {
      const matchCategory = activeCategory === 'SEMUA' || item.category === activeCategory;
      const matchKeyword =
        item.name.toLowerCase().includes(kw) ||
        (item.description && item.description.toLowerCase().includes(kw));
      return matchCategory && matchKeyword;
    });

    this.setState({ filteredItems: filtered });
  };

  // ─── Modal Produk ─────────────────────────────────────────────────────────

  private handleOpenDetailProduk = (item: MenuItem): void => {
    this.setState({ selectedProduct: item, isDetailProdukOpen: true });
  };

  private handleCloseDetailProduk = (): void => {
    this.setState({ isDetailProdukOpen: false, selectedProduct: null });
  };

  // ─── Modal Keranjang ──────────────────────────────────────────────────────

  private handleOpenKeranjang = (): void => {
    this.setState({ isDetailKeranjangOpen: true });
  };

  private handleCloseKeranjang = (): void => {
    this.setState({ isDetailKeranjangOpen: false });
  };

  // ─── Keranjang Logic ──────────────────────────────────────────────────────

  private handleAddToCart = (item: MenuItem, quantity: number): void => {
    const token = localStorage.getItem('access_token');

    if (!token || token === 'null') {
      if (window.confirm(`Login diperlukan untuk memesan ${item.name}. Ke halaman login?`)) {
        this.props.navigate('/login');
      }
      return;
    }

    this.setState((prevState) => {
      const existing = prevState.cartItems.find((ci) => ci.item.id === item.id);
      if (existing) {
        // Update qty, tidak melebihi stok
        const newQty = Math.min(existing.quantity + quantity, item.stock);
        return {
          cartItems: prevState.cartItems.map((ci) =>
            ci.item.id === item.id ? { ...ci, quantity: newQty } : ci
          ),
        };
      }
      return {
        cartItems: [...prevState.cartItems, { item, quantity }],
      };
    });
  };

  private handleUpdateQuantity = (itemId: number, newQuantity: number): void => {
    if (newQuantity <= 0) {
      this.handleRemoveItem(itemId);
      return;
    }
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.map((ci) => {
        if (ci.item.id === itemId) {
          const clampedQty = Math.min(newQuantity, ci.item.stock);
          return { ...ci, quantity: clampedQty };
        }
        return ci;
      }),
    }));
  };

  private handleRemoveItem = (itemId: number): void => {
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.filter((ci) => ci.item.id !== itemId),
    }));
  };

  private handleCheckout = (): void => {
    this.setState({ isDetailKeranjangOpen: false });
    this.props.navigate('/checkout');
  };

  private getTotalCartItems(): number {
    return this.state.cartItems.reduce((total, ci) => total + ci.quantity, 0);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  render() {
    const {
      umkm,
      filteredItems,
      averageRating,
      isLoading,
      error,
      searchKeyword,
      activeCategory,
      cartItems,
      selectedProduct,
      isDetailProdukOpen,
      isDetailKeranjangOpen,
    } = this.state;

    if (isLoading) return <LoadingSpinner size="lg" />;
    if (error) return <ErrorBanner message={error} onRetry={this.fetchPageData} />;
    if (!umkm) return <ErrorBanner message="Kantin tidak ditemukan." />;

    const totalCartItems = this.getTotalCartItems();

    return (
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white min-h-screen">
        {/* ─── Header Profil UMKM ─────────────────────────────────────────── */}
        <UMKMProfileHeader umkm={umkm} averageRating={averageRating} />

        {/* ─── Filter Bar (Sticky) ────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 bg-white pt-2 pb-0 border-b border-gray-100">
          <MenuFilterBar
            searchKeyword={searchKeyword}
            activeCategory={activeCategory}
            onSearchChange={this.handleSearchChange}
            onCategoryChange={this.handleCategoryChange}
          />
        </div>

        {/* ─── Grid Menu ──────────────────────────────────────────────────── */}
        <div className="mt-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <div className="text-5xl mb-4">🍽️</div>
              <p className="text-lg font-medium">Tidak ada menu ditemukan.</p>
              <p className="text-sm mt-1">Coba kata kunci atau kategori lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-start">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={this.handleAddToCart}
                  // Prop baru: klik kartu → buka DetailProduk
                  onCardClick={() => this.handleOpenDetailProduk(item)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── Floating Cart Button ───────────────────────────────────────── */}
        {totalCartItems > 0 && (
          <button
            onClick={this.handleOpenKeranjang}
            className="fixed bottom-8 right-6 z-40 bg-[#fca311] hover:bg-[#e8940f] active:scale-95 text-[#132043] font-extrabold py-4 px-6 rounded-2xl flex items-center gap-3 shadow-2xl transition-all focus:outline-none"
            aria-label="Buka keranjang"
          >
            {/* Icon keranjang */}
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Badge jumlah item */}
              <span className="absolute -top-2 -right-2 bg-[#132043] text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            </div>
            <span className="text-sm">Lihat Keranjang</span>
          </button>
        )}

        {/* ─── Modal: Detail Produk ───────────────────────────────────────── */}
        <DetailProduk
          item={selectedProduct}
          isOpen={isDetailProdukOpen}
          onClose={this.handleCloseDetailProduk}
          onAddToCart={this.handleAddToCart}
        />

        {/* ─── Modal: Detail Keranjang ────────────────────────────────────── */}
        <DetailKeranjang
          isOpen={isDetailKeranjangOpen}
          cartItems={cartItems}
          onClose={this.handleCloseKeranjang}
          onCheckout={this.handleCheckout}
          onUpdateQuantity={this.handleUpdateQuantity}
          onRemoveItem={this.handleRemoveItem}
        />
      </div>
    );
  }
}

export default withRouter(ProductDetailPage);