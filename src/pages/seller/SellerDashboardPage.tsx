import { Component } from "react";
import { Link } from "react-router-dom";
import { OrderService } from "../../services/OrderService";
import { CatalogService } from "../../services/CatalogService";
import { PromoService } from "../../services/PromoService";
import { UMKMService } from "../../services/UMKMService";
import { OrderStatus } from "../../domain/enums";
import type { Order } from "../../domain/Order";
import type { UMKM, OperatingHours } from "../../domain/UMKM";
import type { MenuItem } from "../../domain/MenuItem";
import type { Promotion } from "../../domain/Promotion";
import { PageHeader } from "../../components/seller/PageHeader";
import { StatSummaryCard } from "../../components/seller/StatSummaryCard";
import { OperatingHoursManager } from "../../components/seller/OperatingHoursManager";
import { StoreReviewsCard } from "../../components/seller/StoreReviewsCard";

interface State {
  totalRevenue: number;
  totalTransactions: number;
  umkm: UMKM | null;
  allProducts: MenuItem[];
  recentProducts: MenuItem[];
  activePromos: Promotion[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  saveSuccess: boolean;
}

export default class SellerDashboardPage extends Component<{}, State> {
  private orderService = new OrderService();
  private catalogService = new CatalogService();
  private promoService = new PromoService();
  private umkmService = new UMKMService();

  state: State = {
    totalRevenue: 0,
    totalTransactions: 0,
    umkm: null,
    allProducts: [],
    recentProducts: [],
    activePromos: [],
    isLoading: true,
    isSaving: false,
    error: null,
    saveError: null,
    saveSuccess: false,
  };

  componentDidMount() {
    this.fetchDashboardData();
  }

  private getFullImageUrl(path: string | undefined): string {
    const fallback = "/images/default-food.png";
    if (!path) return fallback;
    return path.startsWith("/") ? `http://localhost:8000${path}` : path;
  }

  private fetchDashboardData = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const umkmPromise = (this.umkmService as any).getMyStore
        ? (this.umkmService as any).getMyStore()
        : (this.umkmService as any).getMyProfile();

      const [umkm, orders, products, promos] = await Promise.all([
        umkmPromise,
        this.orderService.getIncomingOrders().catch(() => []),
        this.catalogService.getMyProducts().catch(() => []),
        this.promoService.getMyPromos().catch(() => []),
      ]);

      const doneOrders = (orders as Order[]).filter(
        (o) => o.status === OrderStatus.DONE,
      );

      this.setState({
        umkm: umkm as UMKM,
        totalTransactions: doneOrders.length,
        totalRevenue: doneOrders.reduce(
          (s, o) => s + (Number(o.total_price) || 0),
          0,
        ),
        allProducts: products as MenuItem[],
        recentProducts: (products as MenuItem[]).slice(0, 4),
        activePromos: (promos as Promotion[])
          .filter((p) => p.is_active)
          .slice(0, 3),
      });
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : "Gagal memuat data.",
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleSaveHours = async (hours: OperatingHours) => {
    this.setState({ isSaving: true, saveError: null, saveSuccess: false });
    try {
      const updatedUMKM = await (this.umkmService as any).updateOperatingHours(
        hours,
      );
      this.setState({ umkm: updatedUMKM, saveSuccess: true });
      setTimeout(() => this.setState({ saveSuccess: false }), 3000);
    } catch (err) {
      this.setState({
        saveError:
          err instanceof Error ? err.message : "Gagal menyimpan jadwal.",
      });
    } finally {
      this.setState({ isSaving: false });
    }
  };

  render() {
    const {
      totalRevenue,
      totalTransactions,
      umkm,
      allProducts,
      recentProducts,
      activePromos,
      isLoading,
      isSaving,
      error,
      saveError,
      saveSuccess,
    } = this.state;

    return (
      <div className="w-full relative pb-24 animate-fadeIn">
        <PageHeader title="Dashboard" />

        {saveSuccess && (
          <div className="flex items-center gap-3 bg-green-50 text-green-700 border border-green-200 px-5 py-3 rounded-2xl mb-8 shadow-sm">
            <span className="font-bold text-sm">
              ✅ Jadwal operasional berhasil disimpan!
            </span>
          </div>
        )}

        {saveError && (
          <div className="flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 px-5 py-3 rounded-2xl mb-8 shadow-sm">
            <span className="font-bold text-sm">{saveError}</span>
            <button
              className="ml-auto font-black text-lg"
              onClick={() => this.setState({ saveError: null })}
            >
              ×
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-20 text-[#1B2B65] font-bold animate-pulse">
            Memuat wawasan dasbor...
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-red-50 text-red-600 p-5 rounded-2xl mb-8 border border-red-200 font-medium">
            {error}{" "}
            <button
              onClick={this.fetchDashboardData}
              className="underline ml-2 font-bold hover:text-red-800"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <StatSummaryCard
              totalRevenue={totalRevenue}
              totalTransactions={totalTransactions}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
              <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
                <OperatingHoursManager
                  isOpen={umkm?.is_open ?? false}
                  operatingHours={umkm?.operating_hours ?? null}
                  isSaving={isSaving}
                  onSave={this.handleSaveHours}
                />
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#1B2B65]">
                      Menu Kantin
                    </h3>
                    <Link
                      to="/seller/products"
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                    >
                      Lihat Semua
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>

                  {recentProducts.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      Belum ada menu yang ditambahkan.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {recentProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                        >
                          <img
                            src={this.getFullImageUrl(
                              product.photo_url || (product as any).photoUrl,
                            )}
                            alt={product.name}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/default-food.png";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#1B2B65] truncate text-base">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-500 font-medium">
                              Stok: {product.stock}
                            </p>
                          </div>
                          <div className="font-extrabold text-[#FFB20E] shrink-0 text-right">
                            Rp {product.price.toLocaleString("id-ID")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 w-full flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-[#1B2B65]">
                        Promo Aktif
                      </h3>
                      <Link
                        to="/seller/promos"
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                      >
                        Lihat Semua
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>

                    {activePromos.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-center py-10 text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        Tidak ada promo aktif.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-100">
                        {activePromos.map((promo) => (
                          <div
                            key={promo.id}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-yellow-50 to-white border border-yellow-100 shadow-sm"
                          >
                            <div className="w-12 h-12 rounded-full bg-[#FFB20E]/20 flex items-center justify-center shrink-0">
                              <span className="text-xl">🎉</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-[#1B2B65] truncate">
                                {promo.name}
                              </h4>
                              <p className="text-xs text-gray-500 font-medium mt-0.5">
                                S/d{" "}
                                {new Date(promo.end_date).toLocaleDateString(
                                  "id-ID",
                                )}
                              </p>
                            </div>
                            <div className="bg-[#1B2B65] text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm whitespace-nowrap">
                              {promo.discount_type === "PERCENTAGE"
                                ? `${promo.discount_value}% OFF`
                                : `- Rp ${Number(
                                    promo.discount_value,
                                  ).toLocaleString("id-ID")}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <StoreReviewsCard products={allProducts} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}
