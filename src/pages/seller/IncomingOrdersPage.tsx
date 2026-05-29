import { Component } from "react";
import { OrderService } from "../../services/OrderService";
import type { Order } from "../../domain/Order";
import { OrderStatus } from "../../domain/enums";
import type { TabType } from "../../components/seller/OrderTabs";

import { PageHeader } from "../../components/seller/PageHeader";
import { OrderTabs } from "../../components/seller/OrderTabs";
import { OrderTableRow } from "../../components/seller/OrderTableRow";
import { RejectOrderModal } from "../../components/seller/RejectOrderModal";
import { ReadyOrderModal } from "../../components/seller/ReadyOrderModal";

interface IncomingOrdersPageProps {}

interface IncomingOrdersPageState {
  orders: Order[];
  activeTab: TabType;
  isLoading: boolean;
  error: string | null;

  isRejectModalOpen: boolean;
  rejectingOrderId: number | null;
  isReadyModalOpen: boolean;
  readyOrderId: number | null;
  isSubmittingAction: boolean;
}

export default class IncomingOrdersPage extends Component<
  IncomingOrdersPageProps,
  IncomingOrdersPageState
> {
  private orderService: OrderService;

  constructor(props: IncomingOrdersPageProps) {
    super(props);
    this.state = {
      orders: [],
      activeTab: "masuk",
      isLoading: true,
      error: null,
      isRejectModalOpen: false,
      rejectingOrderId: null,
      isReadyModalOpen: false,
      readyOrderId: null,
      isSubmittingAction: false,
    };
    this.orderService = new OrderService();
  }

  componentDidMount() {
    this.fetchIncomingOrders();
  }

  private fetchIncomingOrders = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });
    try {
      const data = await this.orderService.getIncomingOrders();
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      this.setState({ orders: sortedData });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan.";
      this.setState({ error: errorMessage });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleTabChange = (tab: TabType): void => {
    this.setState({ activeTab: tab });
  };

  private getFilteredOrders = (): Order[] => {
    const { orders, activeTab } = this.state;
    return orders.filter((o) => {
      if (activeTab === "masuk") return o.status === OrderStatus.PENDING;
      if (activeTab === "proses")
        return [
          OrderStatus.CONFIRMED,
          OrderStatus.PROCESSING,
          OrderStatus.READY,
        ].includes(o.status);
      if (activeTab === "selesai") return o.status === OrderStatus.DONE;
      if (activeTab === "batal") return o.status === OrderStatus.CANCELLED;
      return false;
    });
  };

  private getTabCounts = () => {
    const { orders } = this.state;
    let masukCount = 0;
    let prosesCount = 0;

    orders.forEach((o) => {
      if (o.status === OrderStatus.PENDING) masukCount++;
      if (
        [
          OrderStatus.CONFIRMED,
          OrderStatus.PROCESSING,
          OrderStatus.READY,
        ].includes(o.status)
      ) {
        prosesCount++;
      }
    });

    return { masuk: masukCount, proses: prosesCount };
  };

  private handleAcceptOrder = async (id: number): Promise<void> => {
    this.setState({ isSubmittingAction: true });
    try {
      const updatedOrder = await this.orderService.confirmOrder(id);
      this.updateOrderInState(updatedOrder);
      this.setState({ activeTab: "proses" });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menerima pesanan.";
      alert(errorMessage);
    } finally {
      this.setState({ isSubmittingAction: false });
    }
  };

  private openReadyModal = (id: number): void => {
    this.setState({ isReadyModalOpen: true, readyOrderId: id });
  };

  private closeReadyModal = (): void => {
    this.setState({ isReadyModalOpen: false, readyOrderId: null });
  };

  private handleReadyConfirm = async (id: number): Promise<void> => {
    this.setState({ isSubmittingAction: true });
    try {
      const updatedOrder = await this.orderService.markOrderReady(id);
      this.updateOrderInState(updatedOrder);
      this.closeReadyModal();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal mengubah status.";
      alert(errorMessage);
    } finally {
      this.setState({ isSubmittingAction: false });
    }
  };

  private openRejectModal = (id: number): void => {
    this.setState({ isRejectModalOpen: true, rejectingOrderId: id });
  };

  private closeRejectModal = (): void => {
    this.setState({ isRejectModalOpen: false, rejectingOrderId: null });
  };

  private handleRejectConfirm = async (
    id: number,
    reason: string,
  ): Promise<void> => {
    this.setState({ isSubmittingAction: true });
    try {
      const updatedOrder = await this.orderService.rejectOrder(id, reason);
      this.updateOrderInState(updatedOrder);
      this.closeRejectModal();
      this.setState({ activeTab: "batal" });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menolak pesanan.";
      alert(errorMessage);
    } finally {
      this.setState({ isSubmittingAction: false });
    }
  };

  private updateOrderInState = (updatedOrder: Order) => {
    this.setState((prevState) => ({
      orders: prevState.orders.map((o) =>
        o.id === updatedOrder.id ? updatedOrder : o,
      ),
    }));
  };

  render() {
    const {
      isLoading,
      error,
      activeTab,
      isRejectModalOpen,
      rejectingOrderId,
      isReadyModalOpen,
      readyOrderId,
      isSubmittingAction,
    } = this.state;

    const filteredOrders = this.getFilteredOrders();
    const tabCounts = this.getTabCounts();

    return (
      <div className="w-full relative pb-20">
        <RejectOrderModal
          isOpen={isRejectModalOpen}
          orderId={rejectingOrderId}
          isSubmitting={isSubmittingAction}
          onClose={this.closeRejectModal}
          onConfirm={this.handleRejectConfirm}
        />

        <ReadyOrderModal
          isOpen={isReadyModalOpen}
          orderId={readyOrderId}
          isSubmitting={isSubmittingAction}
          onClose={this.closeReadyModal}
          onConfirm={this.handleReadyConfirm}
        />

        <PageHeader title="Pesanan Masuk" />

        <OrderTabs
          activeTab={activeTab}
          counts={tabCounts}
          onTabChange={this.handleTabChange}
        />

        {isLoading && (
          <div className="flex justify-center py-20 text-[#1B2B65] font-medium">
            Mencari pesanan baru...
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            {error}{" "}
            <button
              onClick={this.fetchIncomingOrders}
              className="underline ml-2"
            >
              Muat Ulang
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-[#FFD13B] text-[#1B2B65]">
                    <th className="py-5 px-6 font-bold w-24">ID</th>
                    <th className="py-5 px-6 font-bold">NAMA</th>
                    <th className="py-5 px-6 font-bold">PESANAN</th>
                    <th className="py-5 px-6 font-bold">TOTAL</th>
                    <th className="py-5 px-6 font-bold text-center w-48">
                      {activeTab === "masuk" ? "KONFIRMASI PESANAN" : "STATUS"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-16 text-center text-gray-500 text-lg"
                      >
                        Tidak ada pesanan di kategori ini.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <OrderTableRow
                        key={order.id}
                        order={order}
                        activeTab={activeTab}
                        onAccept={this.handleAcceptOrder}
                        onReject={this.openRejectModal}
                        onMarkReady={this.openReadyModal}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
}
