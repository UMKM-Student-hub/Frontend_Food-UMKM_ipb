import { Component, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { OrderNotificationToast } from "../components/buyer/OrderNotificationToast";
import { OrderService } from "../services/OrderService";
import { OrderStatus } from "../domain/enums";

const PageLoader = () => (
  <div className="flex flex-col justify-center items-center h-[70vh] w-full bg-[#FFFCF5]">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-[#1B2B65] font-bold animate-pulse tracking-wide">
      Memuat halaman...
    </p>
  </div>
);

interface MainLayoutState {
  notification: {
    isOpen: boolean;
    orderId: number;
    message: string;
  };
}

class MainLayout extends Component<{}, MainLayoutState> {
  private orderService = new OrderService();
  private pollIntervalId: any = null;
  private knownReadyOrders: Set<number> = new Set();

  state: MainLayoutState = {
    notification: {
      isOpen: false,
      orderId: 0,
      message: "",
    },
  };

  componentDidMount() {
    const token = localStorage.getItem("access_token");
    if (token && token !== "null") {
      this.checkOrderStatusUpdates();
      this.pollIntervalId = setInterval(() => {
        this.checkOrderStatusUpdates();
      }, 10000);
    }
  }

  componentWillUnmount() {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
    }
  }

  private checkOrderStatusUpdates = async () => {
    try {
      const orders = await this.orderService.getMyOrders();
      const readyOrders = orders.filter((o) => o.status === OrderStatus.READY);

      if (this.knownReadyOrders.size === 0) {
        readyOrders.forEach((o) => this.knownReadyOrders.add(o.id));
        return;
      }

      for (const order of readyOrders) {
        if (!this.knownReadyOrders.has(order.id)) {
          this.knownReadyOrders.add(order.id);
          this.setState({
            notification: {
              isOpen: true,
              orderId: order.id,
              message:
                "Yey! Makananmu sudah selesai dimasak oleh kantin dan siap untuk kamu ambil sekarang.",
            },
          });
          break;
        }
      }

      const allOrderIds = new Set(orders.map((o) => o.id));
      this.knownReadyOrders.forEach((id) => {
        if (!allOrderIds.has(id)) {
          this.knownReadyOrders.delete(id);
        }
      });
    } catch (error) {
      console.error("Gagal memeriksa pembaruan status pesanan:", error);
    }
  };

  private handleActionNotification = () => {
    this.handleCloseNotification();
    window.location.href = "/my-orders";
  };

  private handleCloseNotification = () => {
    this.setState((prev) => ({
      notification: { ...prev.notification, isOpen: false },
    }));
  };

  render() {
    const { notification } = this.state;

    return (
      <div className="min-h-screen bg-[#FFFCF5] flex flex-col font-sans relative">
        <OrderNotificationToast
          isOpen={notification.isOpen}
          orderId={notification.orderId}
          message={notification.message}
          onAction={this.handleActionNotification}
          onClose={this.handleCloseNotification}
        />

        <Navbar />
        <main className="grow flex flex-col relative w-full">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    );
  }
}

export default MainLayout;
