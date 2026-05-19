import { ApiService } from "./ApiService";
import type { Order, OrderItemPayload } from "../domain/Order";

export class OrderService extends ApiService {
  async createOrder(
    umkmId: number,
    paymentMethod: string,
    paymentProof: File | null,
    items: OrderItemPayload[],
    notes: string = "",
    pickupSchedule: string | null = null,
  ): Promise<Order> {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();

    formData.append("umkm_id", umkmId.toString());
    formData.append("payment_method", paymentMethod);
    formData.append("items", JSON.stringify(items));

    if (notes) {
      formData.append("notes", notes);
    }

    if (pickupSchedule) {
      formData.append("pickup_schedule", pickupSchedule);
    }

    if (paymentProof) {
      formData.append("payment_proof", paymentProof);
    }

    const baseUrl = (this as any).baseUrl || "http://localhost:8000";

    const response = await fetch(`${baseUrl}/orders/`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || "Gagal memproses pesanan ke server.",
      );
    }

    return response.json();
  }

  async getMyOrders(): Promise<Order[]> {
    return this.get<Order[]>("/orders/my");
  }

  async markOrderDone(orderId: number): Promise<Order> {
    return this.patch<Order>(`/orders/${orderId}/done`);
  }

  async getIncomingOrders(): Promise<Order[]> {
    return this.get<Order[]>("/orders/incoming");
  }

  async confirmOrder(orderId: number): Promise<Order> {
    return this.patch<Order>(`/orders/${orderId}/confirm`);
  }

  async rejectOrder(orderId: number, reason: string): Promise<Order> {
    const encodedReason = encodeURIComponent(reason);
    return this.patch<Order>(
      `/orders/${orderId}/reject?reason=${encodedReason}`,
    );
  }

  async markOrderReady(orderId: number): Promise<Order> {
    return this.patch<Order>(`/orders/${orderId}/ready`);
  }
}
