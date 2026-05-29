import { Component } from "react";
import { OrderService } from "../../services/OrderService";
import { CatalogService } from "../../services/CatalogService";
import { ReviewService } from "../../services/ReviewService";
import { OrderCard } from "../../components/buyer/OrderCard";
import { ConfirmDoneModal } from "../../components/buyer/ConfirmDoneModal";
import type { Order } from "../../domain/Order";

interface MyOrdersState {
  orders: Order[];
  umkmMap: Record<number, string>;
  productImageMap: Record<number, string>;
  reviewedItemsMap: Record<number, number[]>;
  isLoading: boolean;
  error: string | null;
  isConfirmDoneModalOpen: boolean;
  confirmDoneOrderId: number | null;
  isSubmittingAction: boolean;
}

export class MyOrdersPage extends Component<
  Record<string, never>,
  MyOrdersState
> {
  private orderService = new OrderService();
  private catalogService = new CatalogService();
  private reviewService = new ReviewService();

  state: MyOrdersState = {
    orders: [],
    umkmMap: {},
    productImageMap: {},
    reviewedItemsMap: {},
    isLoading: true,
    error: null,
    isConfirmDoneModalOpen: false,
    confirmDoneOrderId: null,
    isSubmittingAction: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  private fetchData = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });

    try {
      const [orders, myReviews] = await Promise.all([
        this.orderService.getMyOrders(),
        this.reviewService.getMyReviews().catch(() => []),
      ]);

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
      const reviewedItemsMap: Record<number, number[]> = {};

      umkmResults.forEach((umkm, index) => {
        if (umkm) umkmMap[uniqueUmkmIds[index]] = umkm.name;
      });

      menuResults.forEach((menu, index) => {
        if (menu) {
          productImageMap[uniqueMenuIds[index]] =
            menu.photo_url || (menu as Record<string, string>).photoUrl || "";
        }
      });

      myReviews.forEach((r) => {
        if (!reviewedItemsMap[r.order_id]) {
          reviewedItemsMap[r.order_id] = [];
        }
        reviewedItemsMap[r.order_id].push(r.menu_item_id);
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
        reviewedItemsMap,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat daftar pesanan.";
      this.setState({ error: errorMessage });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleOpenConfirmDoneModal = (orderId: number): void => {
    this.setState({
      isConfirmDoneModalOpen: true,
      confirmDoneOrderId: orderId,
    });
  };

  private handleCloseConfirmDoneModal = (): void => {
    this.setState({ isConfirmDoneModalOpen: false, confirmDoneOrderId: null });
  };

  private handleConfirmMarkDone = async (orderId: number): Promise<void> => {
    this.setState({ isSubmittingAction: true });
    try {
      await this.orderService.markOrderDone(orderId);
      await this.fetchData();
      this.handleCloseConfirmDoneModal();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menyelesaikan pesanan.";
      this.setState({ error: errorMessage, isSubmittingAction: false });
      this.handleCloseConfirmDoneModal();
    }
  };

  render() {
    const {
      orders,
      umkmMap,
      productImageMap,
      reviewedItemsMap,
      isLoading,
      error,
      isConfirmDoneModalOpen,
      confirmDoneOrderId,
      isSubmittingAction,
    } = this.state;

    if (isLoading && orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#F8F9FA]">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#FFB20E] border-t-transparent"></div>
        </div>
      );
    }

    if (error && orders.length === 0) {
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
      <div className="min-h-screen bg-[#F8F9FA] pb-24 relative">
        <ConfirmDoneModal
          isOpen={isConfirmDoneModalOpen}
          orderId={confirmDoneOrderId}
          isSubmitting={isSubmittingAction}
          onClose={this.handleCloseConfirmDoneModal}
          onConfirm={this.handleConfirmMarkDone}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 py-10 md:py-14">
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
            <div className="flex flex-col gap-5">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  umkmName={umkmMap[order.umkm_id] || "UMKM Tidak Dikenal"}
                  imageUrlMap={productImageMap}
                  initialReviewedMenuIds={reviewedItemsMap[order.id] || []}
                  onMarkDone={this.handleOpenConfirmDoneModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
