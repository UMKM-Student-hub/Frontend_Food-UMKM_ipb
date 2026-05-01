import { ApiService } from "./ApiService";
import { Review, ReviewCreateRequest } from "../domain/Review";

export class ReviewService extends ApiService {
  // --- Pembeli ---
  async submitReview(payload: ReviewCreateRequest): Promise<Review> {
    // Menggunakan POST /reviews/
    return this.post<Review>("/reviews/", payload);
  }

  async getProductReviews(menuItemId: number): Promise<Review[]> {
    return this.get<Review[]>(`/reviews/product/${menuItemId}`);
  }

  // --- Penjual ---
  async getUMKMReviews(): Promise<Review[]> {
    return this.get<Review[]>("/reviews/umkm/my");
  }
}
