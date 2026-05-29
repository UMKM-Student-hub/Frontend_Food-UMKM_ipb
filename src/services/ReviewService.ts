import { ApiService } from "./ApiService";
import type { Review } from "../domain/Review";

export interface ReviewCreateRequest {
  order_id: number;
  menu_item_id: number;
  rating: number;
  comment?: string;
}

export class ReviewService extends ApiService {
  async submitReview(payload: ReviewCreateRequest): Promise<Review> {
    return this.post<Review>("/reviews/", payload);
  }

  async getProductReviews(menuItemId: number): Promise<Review[]> {
    return this.get<Review[]>(`/reviews/product/${menuItemId}`);
  }

  async getUMKMReviews(): Promise<Review[]> {
    return this.get<Review[]>("/reviews/umkm/my");
  }

  async getUMKMPublicReviews(umkmId: number): Promise<Review[]> {
    return this.get<Review[]>(`/reviews/umkm/${umkmId}`);
  }

  async getMyReviews(): Promise<Review[]> {
    return this.get<Review[]>("/reviews/my");
  }
}
