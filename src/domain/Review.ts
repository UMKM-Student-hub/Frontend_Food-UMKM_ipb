export interface Review {
  id: number;
  order_id: number;
  buyer_id: number;
  menu_item_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewCreateRequest {
  order_id: number;
  rating: number;
  comment: string;
}
