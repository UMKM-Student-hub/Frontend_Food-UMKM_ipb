import { ApiService } from "./ApiService";
import type { Order, CreateOrderRequest } from "../domain/Order";

export class OrderService extends ApiService {
  // --- Pembeli (Buyer) ---

  async createOrder(payload: CreateOrderRequest): Promise<Order> {
    return this.post<Order>("/orders/", payload);
  }

  async getMyOrders(): Promise<Order[]> {
    return this.get<Order[]>("/orders/my");
  }

  async markOrderDone(orderId: number): Promise<Order> {
    return this.patch<Order>(`/orders/${orderId}/done`);
  }

  // --- Penjual (Seller) ---

  async getIncomingOrders(): Promise<Order[]> {
    return this.get<Order[]>("/orders/incoming");
  }

  async confirmOrder(orderId: number): Promise<Order> {
    return this.patch<Order>(`/orders/${orderId}/confirm`);
  }

  async rejectOrder(orderId: number, reason: string): Promise<Order> {
    // Backend meminta parameter reason di Query string
    const encodedReason = encodeURIComponent(reason);
    return this.patch<Order>(
      `/orders/${orderId}/reject?reason=${encodedReason}`,
    );
  }

  async markOrderReady(orderId: number): Promise<Order> {
    return this.patch<Order>(`/orders/${orderId}/ready`);
  }
}
