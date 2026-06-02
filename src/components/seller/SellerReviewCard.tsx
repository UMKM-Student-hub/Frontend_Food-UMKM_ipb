import { Component } from "react";
import type { Review } from "../../domain/Review";

interface SellerReviewCardProps {
  review: Review;
  productName: string;
}

export class SellerReviewCard extends Component<SellerReviewCardProps> {
  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  private renderStars(rating: number) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
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
    const { review, productName } = this.props;

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <div>
            <h4 className="font-extrabold text-[#1B2B65] text-lg mb-1.5">
              {productName}
            </h4>
            <div className="flex items-center gap-3">
              {this.renderStars(review.rating)}
              <span className="text-sm font-medium text-gray-400">
                {this.formatDate(review.created_at)}
              </span>
            </div>
          </div>
          {review.buyer_name && (
            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 self-start sm:self-auto">
              <span className="text-xs text-gray-500 font-bold block mb-0.5">
                Diulas oleh:
              </span>
              <span className="text-sm font-black text-[#1B2B65]">
                {review.buyer_name}
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-50">
          {review.comment ? (
            `"${review.comment}"`
          ) : (
            <span className="italic text-gray-400">
              Pembeli hanya memberikan rating bintang tanpa komentar tertulis.
            </span>
          )}
        </p>
      </div>
    );
  }
}
