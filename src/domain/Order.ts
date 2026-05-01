import { OrderStatus } from "./enums";
import type { MenuItem } from "./MenuItem";

export interface OrderItem {
  id: number;
  menu_item_id: number;
  menu_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  buyer_id: number;
  umkm_id: number;
  items: OrderItem[];
  notes: string;
  status: OrderStatus;
  rejection_reason: string | null;
  pickup_schedule: string | null;
  queue_number: string;
  total_price: number;
  created_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CreateOrderRequest {
  umkm_id: number;
  items: { menu_item_id: number; quantity: number }[];
  notes: string;
  pickup_schedule: string | null;
}
