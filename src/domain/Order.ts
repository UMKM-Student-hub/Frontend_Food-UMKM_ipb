import { OrderStatus } from "./enums";
import type { MenuItem } from "./MenuItem";

export interface OrderItem {
  id: number;
  menu_item_id: number;
  menu_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes: string;
}

export interface Order {
  id: number;
  buyer_id: number;
  umkm_id: number;
  items: OrderItem[];
  notes: string;
  status: OrderStatus;
  payment_method: string;
  payment_proof_url: string | null;
  rejection_reason: string | null;
  pickup_schedule: string | null;
  queue_number: string | null;
  total_price: number;
  created_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export interface OrderItemPayload {
  menu_item_id: number;
  quantity: number;
  note: string;
}
