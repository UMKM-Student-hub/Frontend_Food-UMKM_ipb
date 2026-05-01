import { ProductCategory } from "./enums";
import type { Promotion } from "./Promotion";

export interface MenuItem {
  id: number;
  umkm_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  photo_url: string | null;
  category: ProductCategory;
  is_active: boolean;
  active_promo?: Promotion | null;
}

export interface MenuItemCreateRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  photo_url?: string;
}
