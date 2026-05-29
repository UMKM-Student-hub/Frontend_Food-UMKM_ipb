import { ApiService } from "./ApiService";
import type { UMKM } from "../domain/UMKM";

export interface UMKMCreateRequest {
  name: string;
  location: string;
  description?: string;
}

export class UMKMService extends ApiService {
  async createUMKM(payload: UMKMCreateRequest): Promise<UMKM> {
    return this.post<UMKM>("/umkm/", payload);
  }

  async createProfile(payload: UMKMCreateRequest): Promise<UMKM> {
    return this.post<UMKM>("/umkm/", payload);
  }

  async getMyStore(): Promise<UMKM> {
    return this.get<UMKM>("/umkm/me");
  }

  async listAllUMKM(): Promise<UMKM[]> {
    return this.get<UMKM[]>("/umkm/");
  }

  async toggleStoreStatus(umkmId: number): Promise<UMKM> {
    return this.patch<UMKM>(`/umkm/${umkmId}/toggle-status`);
  }
}

export const umkmService = new UMKMService();