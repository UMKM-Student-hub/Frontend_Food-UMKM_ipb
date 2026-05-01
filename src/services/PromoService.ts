import { ApiService } from "./ApiService";
import type { Promotion, CreatePromoRequest } from "../domain/Promotion";

export class PromoService extends ApiService {
  // --- Pembeli ---
  async listActivePromos(): Promise<Promotion[]> {
    return this.get<Promotion[]>("/promos/active");
  }

  // --- Penjual ---
  async getMyPromos(): Promise<Promotion[]> {
    return this.get<Promotion[]>("/promos/my");
  }

  async createPromo(payload: CreatePromoRequest): Promise<Promotion> {
    return this.post<Promotion>("/promos/", payload);
  }

  async deactivatePromo(promoId: number): Promise<Promotion> {
    return this.patch<Promotion>(`/promos/${promoId}/deactivate`);
  }
}
