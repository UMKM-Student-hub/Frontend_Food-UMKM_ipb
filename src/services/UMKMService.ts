import { ApiService } from "./ApiService";
import type { UMKM, OperatingHours } from "../domain/UMKM";

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

  async updateOperatingHours(hours: OperatingHours): Promise<UMKM> {
    return this.put<UMKM>("/umkm/me/operating-hours", hours);
  }
}

export const umkmService = new UMKMService();
