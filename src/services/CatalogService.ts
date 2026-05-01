import { ApiService } from "./ApiService";
import type { UMKM } from "../domain/UMKM";
import type { MenuItem, MenuItemCreateRequest } from "../domain/MenuItem";

export class CatalogService extends ApiService {
  // --- Pembeli (Buyer) ---

  async listAllUMKM(): Promise<UMKM[]> {
    // Sesuai catalog_controller.py -> @router.get("/")
    return this.get<UMKM[]>("/products/");
  }

  async getUMKMMenu(umkmId: number): Promise<MenuItem[]> {
    // Sesuai catalog_controller.py -> @router.get("/umkm/{umkm_id}")
    return this.get<MenuItem[]>(`/products/umkm/${umkmId}`);
  }

  async searchProducts(
    keyword?: string,
    category?: string,
  ): Promise<MenuItem[]> {
    const q = new URLSearchParams();
    if (keyword) q.append("keyword", keyword);
    if (category) q.append("category", category);
    return this.get<MenuItem[]>(`/products/search?${q.toString()}`);
  }

  async getProductDetail(menuItemId: number): Promise<MenuItem> {
    return this.get<MenuItem>(`/products/${menuItemId}`);
  }

  // --- Penjual (Seller) ---

  async addProduct(payload: MenuItemCreateRequest): Promise<MenuItem> {
    return this.post<MenuItem>("/products/", payload);
  }

  async updateStock(itemId: number, newStock: number): Promise<MenuItem> {
    // Backend menggunakan Query Parameter: ?new_stock=
    return this.patch<MenuItem>(
      `/products/${itemId}/stock?new_stock=${newStock}`,
    );
  }

  async deleteProduct(itemId: number): Promise<MenuItem> {
    return this.delete<MenuItem>(`/products/${itemId}`);
  }

  async reactivateProduct(itemId: number): Promise<MenuItem> {
    return this.patch<MenuItem>(`/products/${itemId}/reactivate`);
  }

  async toggleStoreStatus(umkmId: number): Promise<UMKM> {
    // Diambil dari umkm_controller.py -> @router.patch("/{id}/toggle-status")
    return this.patch<UMKM>(`/umkm/${umkmId}/toggle-status`);
  }
}
