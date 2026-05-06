import { ApiService } from "./ApiService";
import { UMKMCreateRequest } from "../domain/UMKM";
import { UMKM } from "../domain/UMKM";

class UMKMService extends ApiService {
  async createUMKM(payload: UMKMCreateRequest): Promise<UMKM> {
    return this.post<UMKM>("/umkm/", payload);
  }
}

export const umkmService = new UMKMService();
