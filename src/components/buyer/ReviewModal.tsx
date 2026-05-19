import { Component } from "react";
import type { Review } from "../../domain/Review";
import { ReviewService } from "../../services/ReviewService";

interface ReviewModalProps {
  isOpen: boolean;
  umkmId: number;
  onClose: () => void;
}

interface ReviewModalState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

export class ReviewModal extends Component<ReviewModalProps, ReviewModalState> {
  private reviewService = new ReviewService();

  constructor(props: ReviewModalProps) {
    super(props);
    this.state = {
      reviews: [],
      isLoading: true,
      error: null,
    };
  }

  componentDidUpdate(prevProps: ReviewModalProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.fetchReviews();
    }
  }

  private fetchReviews = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });
    try {
      const reviews = await this.reviewService.getUMKMPublicReviews(
        this.props.umkmId,
      );

      const sortedReviews = reviews.sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      this.setState({ reviews: sortedReviews, isLoading: false });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat ulasan pelanggan.";
      this.setState({ error: errorMessage, isLoading: false });
    }
  };

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  private renderStars(rating: number) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-[#FFB20E]" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        ))}
      </div>
    );
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { reviews, isLoading, error } = this.state;

    if (!isOpen) return null;

    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
          ).toFixed(1)
        : "0";

    return (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity"
        style={{
          backgroundColor: "rgba(27, 43, 101, 0.6)",
          backdropFilter: "blur(6px)",
        }}
        onClick={onClose}
      >
        <div
          className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-slideUp sm:animate-fadeIn h-[85vh] sm:h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0 bg-white">
            <h2 className="text-xl font-black text-[#1B2B65] tracking-wide">
              Ulasan Pelanggan
            </h2>
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors focus:outline-none"
            >
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div
            className="overflow-y-auto flex-1 bg-gray-50 p-6"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FFB20E] border-t-transparent"></div>
                <p className="text-gray-400 font-medium">Memuat ulasan...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <button
                  onClick={this.fetchReviews}
                  className="bg-[#1B2B65] text-white px-6 py-2 rounded-full font-bold"
                >
                  Coba Lagi
                </button>
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <svg
                  className="w-16 h-16 mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="font-bold text-lg text-gray-500">
                  Belum ada ulasan
                </p>
                <p className="text-sm">
                  Jadilah yang pertama mencoba dan memberikan ulasan!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 mb-2">
                  <div className="text-5xl font-black text-[#1B2B65]">
                    {averageRating}
                  </div>
                  <div className="flex flex-col gap-1">
                    {this.renderStars(Math.round(Number(averageRating)))}
                    <span className="text-gray-500 text-sm font-medium">
                      Dari {reviews.length} ulasan
                    </span>
                  </div>
                </div>

                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1B2B65]">
                          {review.buyer_name || "Pelanggan UniBites"}
                        </span>
                        <span className="text-xs font-medium text-gray-400">
                          {this.formatDate(review.created_at)}
                        </span>
                      </div>
                      {this.renderStars(review.rating)}
                    </div>
                    {review.menu_name && (
                      <span className="text-xs font-bold text-[#FFB20E] bg-[#FFB20E]/10 px-2 py-1 rounded w-fit">
                        Menu: {review.menu_name}
                      </span>
                    )}
                    {review.comment && (
                      <p className="text-gray-600 text-sm leading-relaxed mt-1">
                        "{review.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
