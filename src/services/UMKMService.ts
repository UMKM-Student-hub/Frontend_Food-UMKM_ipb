import { ApiService } from "./ApiService";
import { UMKMCreateRequest } from "../domain/UMKM";
import { UMKM } from "../domain/UMKM";

class UMKMService extends ApiService {
  async createUMKM(payload: UMKMCreateRequest): Promise<UMKM> {
    return this.post<UMKM>("/umkm/", payload);
  }

  async toggleStoreStatus(umkmId: number): Promise<UMKM> {
    return this.patch<UMKM>(`/umkm/${umkmId}/toggle-status`);
  }
}

export const umkmService = new UMKMService();
