import { Component } from "react";
import { OrderService } from "../../services/OrderService";
import { umkmService } from "../../services/UMKMService";
import { OrderStatus } from "../../domain/enums";
import type { Order } from "../../domain/Order";
import type { UMKM } from "../../domain/UMKM";
import { PageHeader } from "../../components/seller/PageHeader";
import { StatSummaryCard } from "../../components/seller/StatSummaryCard";
import { StoreStatusToggle } from "../../components/seller/StoreStatusToggle";

interface SellerDashboardPageProps {}

interface SellerDashboardPageState {
  totalRevenue: number;
  totalTransactions: number;
  umkm: UMKM | null;
  isStoreOpen: boolean;
  isLoading: boolean;
  isToggleLoading: boolean;
  error: string | null;
  toggleError: string | null;
}

export default class SellerDashboardPage extends Component<
  SellerDashboardPageProps,
  SellerDashboardPageState
> {
  private orderService: OrderService;

  constructor(props: SellerDashboardPageProps) {
    super(props);
    this.state = {
      totalRevenue: 0,
      totalTransactions: 0,
      umkm: null,
      isStoreOpen: false,
      isLoading: true,
      isToggleLoading: false,
      error: null,
      toggleError: null,
    };
    this.orderService = new OrderService();
  }

  componentDidMount() {
    this.fetchDashboardData();
  }

  private fetchDashboardData = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });

    try {
      const [umkm, orders]: [UMKM, Order[]] = await Promise.all([
        umkmService.getMyStore(),
        this.orderService.getIncomingOrders(),
      ]);

      const doneOrders = orders.filter(
        (order) => order.status === OrderStatus.DONE,
      );
      const transactions = doneOrders.length;
      const revenue = doneOrders.reduce(
        (sum, order) => sum + order.total_price,
        0,
      );

      this.setState({
        umkm,
        isStoreOpen: umkm.is_open,
        totalTransactions: transactions,
        totalRevenue: revenue,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat data dashboard.";
      this.setState({ error: errorMessage });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleToggleStoreStatus = async (): Promise<void> => {
    const { umkm, isStoreOpen, isToggleLoading } = this.state;

    if (!umkm || isToggleLoading) return;

    const previousIsOpen = isStoreOpen;

    this.setState({
      isStoreOpen: !isStoreOpen,
      isToggleLoading: true,
      toggleError: null,
    });

    try {
      const updatedUMKM = await umkmService.toggleStoreStatus(umkm.id);

      this.setState({
        umkm: updatedUMKM,
        isStoreOpen: updatedUMKM.is_open,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Gagal mengubah status toko. Silakan coba lagi.";
      this.setState({
        isStoreOpen: previousIsOpen,
        toggleError: errorMessage,
      });
    } finally {
      this.setState({ isToggleLoading: false });
    }
  };

  render() {
    const {
      totalRevenue,
      totalTransactions,
      isStoreOpen,
      isLoading,
      isToggleLoading,
      error,
      toggleError,
    } = this.state;

    return (
      <div className="w-full relative pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <PageHeader title="Dashboard" />

          <StoreStatusToggle
            isOpen={isStoreOpen}
            isLoading={isLoading || isToggleLoading}
            onToggle={this.handleToggleStoreStatus}
          />
        </div>

        {toggleError && (
          <div className="flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 px-5 py-3 rounded-xl mb-6 shadow-sm">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <span className="font-semibold text-sm">{toggleError}</span>
            <button
              className="ml-auto text-red-500 hover:text-red-800 font-bold text-lg leading-none"
              onClick={() => this.setState({ toggleError: null })}
              aria-label="Tutup notifikasi error"
            >
              ×
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-20 text-[#1B2B65] font-medium animate-pulse">
            Memuat data dashboard...
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200 shadow-sm">
            {error}{" "}
            <button
              onClick={this.fetchDashboardData}
              className="underline ml-2 font-semibold hover:text-red-800"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <StatSummaryCard
            totalRevenue={totalRevenue}
            totalTransactions={totalTransactions}
          />
        )}
      </div>
    );
  }
}
