import { Component } from "react";

// Import Services & Enums
import { OrderService } from "../../services/OrderService";
import { OrderStatus } from "../../domain/enums";
import type { Order } from "../../domain/Order";

// Import Components
import { PageHeader } from "../../components/seller/PageHeader";
import { StatSummaryCard } from "../../components/seller/StatSummaryCard";
import { StoreStatusToggle } from "../../components/seller/StoreStatusToggle";

interface SellerDashboardPageProps {}

interface SellerDashboardPageState {
  totalRevenue: number;
  totalTransactions: number;
  isStoreOpen: boolean;
  isLoading: boolean;
  isToggleLoading: boolean;
  error: string | null;
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
      isStoreOpen: true, // Default toko buka, idealnya ditarik dari AuthContext/ProfileService
      isLoading: true,
      isToggleLoading: false,
      error: null,
    };
    this.orderService = new OrderService();
  }

  componentDidMount() {
    this.fetchDashboardData();
  }

  // --- API CALLS & KALKULASI ---

  private fetchDashboardData = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });

    try {
      // Ambil seluruh riwayat pesanan
      const orders: Order[] = await this.orderService.getIncomingOrders();

      // Kalkulasi Metrik: Filter HANYA pesanan yang berstatus DONE (Selesai)
      const doneOrders = orders.filter(
        (order) => order.status === OrderStatus.DONE,
      );

      // Hitung Total Transaksi (Jumlah pesanan yang selesai)
      const transactions = doneOrders.length;

      // Hitung Total Penjualan (Jumlah total harga dari pesanan yang selesai)
      const revenue = doneOrders.reduce(
        (sum, order) => sum + order.total_price,
        0,
      );

      this.setState({
        totalTransactions: transactions,
        totalRevenue: revenue,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Gagal memuat data metrik dashboard.";
      this.setState({ error: errorMessage });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // --- HANDLER STATUS TOKO ---

  private handleToggleStoreStatus = async (): Promise<void> => {
    this.setState({ isToggleLoading: true });

    try {
      // Simulasi pemanggilan API ke backend untuk mengubah status toko.
      // Jika nanti kamu punya AuthService/ProfileService, panggil di sini.
      // await this.profileService.updateStoreStatus(!this.state.isStoreOpen);

      // Simulasi delay jaringan 1 detik agar animasi loading di tombol terlihat
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.setState((prevState) => ({
        isStoreOpen: !prevState.isStoreOpen,
      }));
    } catch (err: unknown) {
      alert("Gagal mengubah status toko. Silakan coba lagi.");
    } finally {
      this.setState({ isToggleLoading: false });
    }
  };

  // --- RENDER ---

  render() {
    const {
      totalRevenue,
      totalTransactions,
      isStoreOpen,
      isLoading,
      isToggleLoading,
      error,
    } = this.state;

    return (
      <div className="w-full relative pb-20">
        {/* Header dengan Toggle Status Toko di sebelah kanan */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <PageHeader title="Dashboard" />

          {/* Komponen Toggle Status Buka/Tutup */}
          <StoreStatusToggle
            isOpen={isStoreOpen}
            isLoading={isToggleLoading}
            onToggle={this.handleToggleStoreStatus}
          />
        </div>

        {/* Handling State: Loading & Error */}
        {isLoading && (
          <div className="flex justify-center py-20 text-[#1B2B65] font-medium">
            Mengkalkulasi metrik penjualan...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 shadow-sm">
            {error}{" "}
            <button
              onClick={this.fetchDashboardData}
              className="underline ml-2 font-semibold hover:text-red-800"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Banner Metrik Penjualan */}
        {!isLoading && !error && (
          <StatSummaryCard
            totalRevenue={totalRevenue}
            totalTransactions={totalTransactions}
          />
        )}

        {/* 
          Catatan Ekstra: Jika nanti kamu ingin menambahkan grafik garis (Line Chart) 
          atau daftar ulasan (Review) terbaru di bawah banner kuning, 
          area ini sangat cocok untuk meletakkannya.
        */}
      </div>
    );
  }
}
