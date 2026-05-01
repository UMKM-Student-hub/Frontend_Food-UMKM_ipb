import { DiscountType } from "./enums";

export interface Promotion {
  id: number;
  umkm_id: number;
  menu_item_id: number;
  name: string;
  photo_url: string | null;
  discount_type: DiscountType;
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface CreatePromoRequest {
  menu_item_id: number;
  name: string;
  photo_url?: string;
  discount_type: DiscountType;
  discount_value: number;
  start_date: string;
  end_date: string;
}
