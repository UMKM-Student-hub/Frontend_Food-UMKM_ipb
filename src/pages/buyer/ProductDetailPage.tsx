import { Component } from "react";
import { CatalogService } from "../../services/CatalogService";
import { OrderService } from "../../services/OrderService";
import type { UMKM } from "../../domain/UMKM";
import type { MenuItem } from "../../domain/MenuItem";
import { ProductCategory } from "../../domain/enums";
import { withRouter } from "../../utils/withRouter";
import { UMKMProfileHeader } from "../../components/buyer/UMKMProfileHeader";
import { MenuFilterBar } from "../../components/buyer/MenuFilterBar";
import { MenuItemCard } from "../../components/buyer/MenuItemCard";
import { DetailProduk } from "../../components/buyer/DetailProduk";
import { DetailKeranjang } from "../../components/buyer/DetailKeranjang";
import type { CartItem } from "../../components/buyer/DetailKeranjang";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorBanner } from "../../components/common/ErrorBanner";

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
  activeCategory: ProductCategory | "SEMUA";
  cartItems: CartItem[];
  selectedProduct: MenuItem | null;
  isDetailProdukOpen: boolean;
  isDetailKeranjangOpen: boolean;
  isSubmittingOrder: boolean; // <-- STATE BARU UNTUK LOADING CHECKOUT
}

class ProductDetailPage extends Component<RouterProps, ProductDetailState> {
  private catalogService = new CatalogService();
  private orderService = new OrderService(); // <-- INSTANSIASI SERVICE BARU

  constructor(props: RouterProps) {
    super(props);
    this.state = {
      umkm: null,
      menuItems: [],
      filteredItems: [],
      averageRating: null,
      isLoading: true,
      error: null,
      searchKeyword: "",
      activeCategory: "SEMUA",
      cartItems: [],
      selectedProduct: null,
      isDetailProdukOpen: false,
      isDetailKeranjangOpen: false,
      isSubmittingOrder: false,
    };
  }

  async componentDidMount() {
    await this.fetchPageData();
  }

  private fetchPageData = async (): Promise<void> => {
    const { umkmId } = this.props.params;

    if (!umkmId || isNaN(Number(umkmId))) {
      this.setState({
        error: "ID Kantin tidak valid atau tidak ditemukan.",
        isLoading: false,
      });
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
        averageRating: 4.8,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data kantin.";
      this.setState({ error: msg });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleSearchChange = (keyword: string): void => {
    this.setState({ searchKeyword: keyword }, this.applyFilters);
  };

  private handleCategoryChange = (
    category: ProductCategory | "SEMUA",
  ): void => {
    this.setState({ activeCategory: category }, this.applyFilters);
  };

  private applyFilters = (): void => {
    const { menuItems, searchKeyword, activeCategory } = this.state;
    const kw = searchKeyword.toLowerCase().trim();

    const filtered = menuItems.filter((item) => {
      const itemCategory = item.category || (item as any).category_name || "";
      const matchCategory =
        activeCategory === "SEMUA" ||
        itemCategory.toLowerCase() === activeCategory.toLowerCase();
      const matchKeyword =
        item.name.toLowerCase().includes(kw) ||
        (item.description && item.description.toLowerCase().includes(kw));
      return matchCategory && matchKeyword;
    });

    this.setState({ filteredItems: filtered });
  };

  private handleOpenDetailProduk = (item: MenuItem): void => {
    this.setState({ selectedProduct: item, isDetailProdukOpen: true });
  };

  private handleCloseDetailProduk = (): void => {
    this.setState({ isDetailProdukOpen: false, selectedProduct: null });
  };

  private handleOpenKeranjang = (): void => {
    this.setState({ isDetailKeranjangOpen: true });
  };

  private handleCloseKeranjang = (): void => {
    this.setState({ isDetailKeranjangOpen: false });
  };

  private handleAddToCart = (
    item: MenuItem,
    quantity: number,
    note: string = "",
  ): void => {
    const token = localStorage.getItem("access_token");

    if (!token || token === "null") {
      if (
        window.confirm(
          `Login diperlukan untuk memesan ${item.name}. Ke halaman login?`,
        )
      ) {
        this.props.navigate("/login");
      }
      return;
    }

    this.setState((prevState) => {
      const existing = prevState.cartItems.find((ci) => ci.item.id === item.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, item.stock);
        return {
          cartItems: prevState.cartItems.map((ci) =>
            ci.item.id === item.id
              ? { ...ci, quantity: newQty, note: note || ci.note }
              : ci,
          ),
        };
      }
      return {
        cartItems: [...prevState.cartItems, { item, quantity, note }],
      };
    });
  };

  private handleUpdateQuantity = (
    itemId: number,
    newQuantity: number,
  ): void => {
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

  private handleUpdateNote = (itemId: number, note: string): void => {
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.map((ci) =>
        ci.item.id === itemId ? { ...ci, note } : ci,
      ),
    }));
  };

  private handleRemoveItem = (itemId: number): void => {
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.filter((ci) => ci.item.id !== itemId),
    }));
  };

  private handleCheckout = async (
    paymentMethod: string,
    paymentProof: File | null,
  ): Promise<void> => {
    const { umkm, cartItems } = this.state;
    if (!umkm || cartItems.length === 0) return;

    this.setState({ isSubmittingOrder: true });

    try {
      const itemsPayload = cartItems.map((ci) => ({
        menu_item_id: ci.item.id,
        quantity: ci.quantity,
        note: ci.note || "",
      }));

      await this.orderService.createOrder(
        umkm.id,
        paymentMethod,
        paymentProof,
        itemsPayload,
      );

      this.setState({
        cartItems: [],
        isDetailKeranjangOpen: false,
        isSubmittingOrder: false,
      });

      this.props.navigate("/my-orders");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memproses pesanan.";
      alert(msg);
      this.setState({ isSubmittingOrder: false });
    }
  };

  private getTotalCartItems(): number {
    return this.state.cartItems.reduce((total, ci) => total + ci.quantity, 0);
  }

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
      isSubmittingOrder,
    } = this.state;

    if (isLoading) return <LoadingSpinner size="lg" />;
    if (error)
      return (
        <div className="px-4 sm:px-10 lg:px-16 pt-10">
          <ErrorBanner message={error} onRetry={this.fetchPageData} />
        </div>
      );
    if (!umkm)
      return (
        <div className="px-4 sm:px-10 lg:px-16 pt-10">
          <ErrorBanner message="Kantin tidak ditemukan." />
        </div>
      );

    const totalCartItems = this.getTotalCartItems();

    return (
      <div className="bg-[#FFFCF5] min-h-screen font-sans pb-24">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16">
            <UMKMProfileHeader umkm={umkm} averageRating={averageRating} />
          </div>
        </div>

        <div className="sticky top-0 z-30 bg-[#FFFCF5]/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16">
            <MenuFilterBar
              searchKeyword={searchKeyword}
              activeCategory={activeCategory}
              onSearchChange={this.handleSearchChange}
              onCategoryChange={this.handleCategoryChange}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 mt-8 md:mt-10">
          {filteredItems.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-[#1B2B65] font-extrabold text-xl md:text-2xl mb-2 text-center">
                Menu Tidak Ditemukan
              </h3>
              <p className="text-gray-500 font-medium text-center max-w-md">
                Kantin ini tidak memiliki menu yang cocok dengan filter atau
                kata kunci pencarianmu saat ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={(item, qty) => this.handleAddToCart(item, qty)}
                  onCardClick={() => this.handleOpenDetailProduk(item)}
                />
              ))}
            </div>
          )}
        </div>

        {totalCartItems > 0 && (
          <button
            onClick={this.handleOpenKeranjang}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 bg-[#FFB20E] hover:bg-[#F0A500] text-[#1B2B65] font-black py-4 px-6 md:px-8 rounded-full flex items-center gap-4 shadow-[0_10px_40px_rgba(255,178,14,0.4)] transition-all hover:-translate-y-1 active:scale-95 focus:outline-none"
            aria-label="Buka keranjang"
          >
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 md:h-7 md:w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-2.5 -right-3 bg-[#1B2B65] text-white text-xs font-black rounded-full min-w-[22px] h-[22px] flex items-center justify-center border-2 border-[#FFB20E] px-1">
                {totalCartItems}
              </span>
            </div>
            <span className="text-sm md:text-base tracking-wide">
              Lihat Pesanan
            </span>
          </button>
        )}

        <DetailProduk
          item={selectedProduct}
          isOpen={isDetailProdukOpen}
          onClose={this.handleCloseDetailProduk}
          onAddToCart={this.handleAddToCart}
        />

        <DetailKeranjang
          isOpen={isDetailKeranjangOpen}
          cartItems={cartItems}
          isSubmitting={isSubmittingOrder}
          onClose={this.handleCloseKeranjang}
          onCheckout={this.handleCheckout}
          onUpdateQuantity={this.handleUpdateQuantity}
          onUpdateNote={this.handleUpdateNote}
          onRemoveItem={this.handleRemoveItem}
        />
      </div>
    );
  }
}

export default withRouter(ProductDetailPage);
