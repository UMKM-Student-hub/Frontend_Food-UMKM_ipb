import { Component } from "react";
import { OrderService } from "../../services/OrderService";
import { CatalogService } from "../../services/CatalogService";
import { OrderCard } from "../../components/buyer/OrderCard";
import type { Order } from "../../domain/Order";

interface MyOrdersState {
  orders: Order[];
  umkmMap: Record<number, string>;
  productImageMap: Record<number, string>;
  isLoading: boolean;
  error: string | null;
}

export class MyOrdersPage extends Component<
  Record<string, never>,
  MyOrdersState
> {
  private orderService = new OrderService();
  private catalogService = new CatalogService();

  state: MyOrdersState = {
    orders: [],
    umkmMap: {},
    productImageMap: {},
    isLoading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  private fetchData = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });

    try {
      const orders = await this.orderService.getMyOrders();

      const uniqueUmkmIds = Array.from(new Set(orders.map((o) => o.umkm_id)));
      const uniqueMenuIds = Array.from(
        new Set(
          orders.flatMap((o) =>
            o.items ? o.items.map((item) => item.menu_item_id) : [],
          ),
        ),
      ).filter((id) => id !== undefined && id !== null);

      const umkmPromises = uniqueUmkmIds.map((id) =>
        this.catalogService.getUMKMProfile(id).catch(() => null),
      );
      const menuPromises = uniqueMenuIds.map((id) =>
        this.catalogService.getProductDetail(id).catch(() => null),
      );

      const umkmResults = await Promise.all(umkmPromises);
      const menuResults = await Promise.all(menuPromises);

      const umkmMap: Record<number, string> = {};
      const productImageMap: Record<number, string> = {};

      umkmResults.forEach((umkm, index) => {
        if (umkm) umkmMap[uniqueUmkmIds[index]] = umkm.name;
      });

      menuResults.forEach((menu, index) => {
        if (menu) {
          productImageMap[uniqueMenuIds[index]] =
            menu.photo_url || (menu as Record<string, string>).photoUrl || "";
        }
      });

      const sortedOrders = orders.sort((a: Order, b: Order) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      this.setState({
        orders: sortedOrders,
        umkmMap,
        productImageMap,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat daftar pesanan.";
      this.setState({ error: errorMessage });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { orders, umkmMap, productImageMap, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#F8F9FA]">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#FFB20E] border-t-transparent"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-[70vh] bg-[#F8F9FA] px-4 pt-20">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl text-center shadow-sm">
            <p className="text-red-500 font-bold mb-6 text-lg">{error}</p>
            <button
              onClick={this.fetchData}
              className="bg-[#1B2B65] hover:bg-[#102A71] text-white font-bold px-8 py-3 rounded-full transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8F9FA] pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-[#1B2B65] tracking-wide mb-2">
              Pesanan Saya
            </h1>
          </header>

          {orders.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-6xl mb-6">🍽️</span>
              <p className="text-[#1B2B65] font-bold text-xl mb-2">
                Belum ada pesanan nih!
              </p>
              <p className="text-gray-500 mb-8">
                Yuk mulai jelajahi kantin dan pesan makanan favoritmu.
              </p>
              <a
                href="/home"
                className="bg-[#FFB20E] hover:bg-[#F0A500] text-[#1B2B65] font-bold px-8 py-3.5 rounded-full transition-all shadow-md active:scale-95"
              >
                Cari Makanan
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  umkmName={umkmMap[order.umkm_id] || "UMKM Tidak Dikenal"}
                  imageUrlMap={productImageMap}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
