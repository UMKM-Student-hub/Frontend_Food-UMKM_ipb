import { Component } from "react";
import { ReviewService } from "../../services/ReviewService";
import type { Review } from "../../domain/Review";
import type { MenuItem } from "../../domain/MenuItem";

interface StoreReviewsCardProps {
  products: MenuItem[];
}

interface StoreReviewsCardState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

export class StoreReviewsCard extends Component<
  StoreReviewsCardProps,
  StoreReviewsCardState
> {
  private reviewService = new ReviewService();

  constructor(props: StoreReviewsCardProps) {
    super(props);
    this.state = {
      reviews: [],
      isLoading: true,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const reviews = await this.reviewService.getUMKMReviews();
      this.setState({ reviews, isLoading: false });
    } catch (err: any) {
      this.setState({
        error: err.message || "Gagal memuat ulasan toko.",
        isLoading: false,
      });
    }
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  private renderStars(rating: number) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-[#FFB20E]" : "text-gray-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  }

  render() {
    const { reviews, isLoading, error } = this.state;
    const { products } = this.props;

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews
          ).toFixed(1)
        : "0.0";

    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
          <h3 className="text-[#1B2B65] text-xl font-extrabold tracking-wide">
            Ulasan Pelanggan
          </h3>
          {totalReviews > 0 && (
            <div className="flex items-center gap-2 bg-[#FFB20E]/10 px-4 py-2 rounded-xl border border-[#FFB20E]/20">
              <span className="text-[#FFB20E] text-xl leading-none mb-1">
                ★
              </span>
              <span className="font-extrabold text-[#1B2B65] text-xl leading-none">
                {averageRating}
              </span>
              <span className="text-gray-500 text-sm font-medium">
                ({totalReviews})
              </span>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex-1 flex items-center justify-center py-10">
            <span className="text-gray-400 font-medium animate-pulse">
              Memuat ulasan...
            </span>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex-1 flex items-center justify-center py-10">
            <span className="text-red-500 font-medium text-sm bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </span>
          </div>
        )}

        {!isLoading && !error && reviews.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <span className="text-3xl">⭐</span>
            </div>
            <p className="text-gray-500 font-medium">Belum ada ulasan.</p>
            <p className="text-gray-400 text-sm mt-1">
              Selesaikan pesanan untuk mendapatkan ulasan pertama.
            </p>
          </div>
        )}

        {!isLoading && !error && reviews.length > 0 && (
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {reviews.map((review) => {
              const product = products.find(
                (p) => p.id === review.menu_item_id,
              );
              const productName = product
                ? product.name
                : "Menu tidak diketahui";

              return (
                <div
                  key={review.id}
                  className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <div>
                      <p className="font-bold text-[#1B2B65] text-sm md:text-base leading-tight mb-1">
                        {productName}
                      </p>
                      <div className="flex items-center gap-3">
                        {this.renderStars(review.rating)}
                        <span className="text-xs text-gray-400 font-medium">
                          {this.formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                    {review.comment ? (
                      `"${review.comment}"`
                    ) : (
                      <span className="italic text-gray-400">
                        Pembeli tidak meninggalkan komentar.
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
