import { ApiService } from "./ApiService";
import type { UMKM } from "../domain/UMKM";
import type { MenuItem } from "../domain/MenuItem";

export class CatalogService extends ApiService {
  async listAllUMKM(): Promise<UMKM[]> {
    return this.get<UMKM[]>("/products/");
  }

  async getUMKMProfile(umkmId: number): Promise<UMKM> {
    return this.get<UMKM>(`/products/store/${umkmId}`);
  }

  async getUMKMMenu(
    umkmId: number,
    keyword?: string,
    category?: string,
  ): Promise<MenuItem[]> {
    const q = new URLSearchParams();
    if (keyword) q.append("keyword", keyword);
    if (category) q.append("category", category);

    const queryString = q.toString() ? `?${q.toString()}` : "";
    return this.get<MenuItem[]>(`/products/umkm/${umkmId}${queryString}`);
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

  async getMyProducts(): Promise<MenuItem[]> {
    return this.get<MenuItem[]>("/products/my");
  }

  async addProduct(formData: FormData): Promise<MenuItem> {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${this.baseUrl}/products/`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || "Gagal menyimpan produk baru");
    }

    return res.json();
  }

  async updateProduct(id: number, formData: FormData): Promise<MenuItem> {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${this.baseUrl}/products/${id}`, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || "Gagal memperbarui produk");
    }

    return res.json();
  }

  async updateStock(itemId: number, newStock: number): Promise<MenuItem> {
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
}

export const catalogService = new CatalogService();
