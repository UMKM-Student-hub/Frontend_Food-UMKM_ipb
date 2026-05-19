import { ApiService } from "./ApiService";
import type { Promotion } from "../domain/Promotion";

export class PromoService extends ApiService {
  async listActivePromos(): Promise<Promotion[]> {
    return this.get<Promotion[]>("/promos/active");
  }

  async getMyPromos(): Promise<Promotion[]> {
    return this.get<Promotion[]>("/promos/my");
  }

  async createPromo(formData: FormData): Promise<Promotion> {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${this.baseUrl}/promos/`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || "Gagal menyimpan promo baru");
    }

    return res.json();
  }

  async deactivatePromo(promoId: number): Promise<Promotion> {
    return this.patch<Promotion>(`/promos/${promoId}/deactivate`);
  }
}
