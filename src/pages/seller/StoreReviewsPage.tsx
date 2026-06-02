import { Component } from "react";
import { ReviewService } from "../../services/ReviewService";
import { CatalogService } from "../../services/CatalogService";
import type { Review } from "../../domain/Review";
import type { MenuItem } from "../../domain/MenuItem";
import { PageHeader } from "../../components/seller/PageHeader";
import { ReviewSummaryCard } from "../../components/seller/ReviewSummaryCard";
import { SellerReviewCard } from "../../components/seller/SellerReviewCard";

interface StoreReviewsPageState {
  reviews: Review[];
  products: MenuItem[];
  isLoading: boolean;
  error: string | null;
  activeFilter: number | "ALL";
}

export default class StoreReviewsPage extends Component<
  {},
  StoreReviewsPageState
> {
  private reviewService = new ReviewService();
  private catalogService = new CatalogService();

  constructor(props: {}) {
    super(props);
    this.state = {
      reviews: [],
      products: [],
      isLoading: true,
      error: null,
      activeFilter: "ALL",
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  private fetchData = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const [reviewsData, productsData] = await Promise.all([
        this.reviewService.getUMKMReviews().catch(() => []),
        this.catalogService.getMyProducts().catch(() => []),
      ]);

      this.setState({
        reviews: reviewsData as Review[],
        products: productsData as MenuItem[],
      });
    } catch (err: any) {
      this.setState({
        error: err.message || "Gagal memuat data ulasan dan produk.",
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleFilterChange = (filter: number | "ALL") => {
    this.setState({ activeFilter: filter });
  };

  render() {
    const { reviews, products, isLoading, error, activeFilter } = this.state;

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews
          ).toFixed(1)
        : "0.0";

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        ratingCounts[r.rating as keyof typeof ratingCounts]++;
      }
    });

    const filteredReviews =
      activeFilter === "ALL"
        ? reviews
        : reviews.filter((r) => r.rating === activeFilter);

    return (
      <div className="w-full relative pb-24 animate-fadeIn">
        <PageHeader title="Rating & Ulasan" />

        {isLoading && (
          <div className="flex justify-center py-20 text-[#1B2B65] font-bold animate-pulse">
            Memuat ulasan toko...
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-red-50 text-red-600 p-5 rounded-2xl mb-8 border border-red-200 font-medium">
            {error}
            <button
              onClick={this.fetchData}
              className="underline ml-2 font-bold hover:text-red-800"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-6">
              <ReviewSummaryCard
                averageRating={averageRating}
                totalReviews={totalReviews}
                ratingCounts={ratingCounts}
                activeFilter={activeFilter}
                onFilterChange={this.handleFilterChange}
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-full min-h-75">
                  <span className="text-6xl mb-4">⭐</span>
                  <p className="text-lg font-bold text-[#1B2B65]">
                    Belum Ada Ulasan
                  </p>
                  <p className="text-gray-500 mt-2">
                    Toko kamu belum menerima ulasan dari pembeli.
                  </p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-full min-h-75">
                  <p className="text-lg font-bold text-[#1B2B65]">
                    Tidak Ditemukan
                  </p>
                  <p className="text-gray-500 mt-2">
                    Tidak ada ulasan dengan {activeFilter} Bintang.
                  </p>
                  <button
                    onClick={() => this.handleFilterChange("ALL")}
                    className="mt-4 text-[#FFB20E] font-bold hover:underline"
                  >
                    Tampilkan Semua Ulasan
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredReviews.map((review) => {
                    const product = products.find(
                      (p) => p.id === review.menu_item_id,
                    );
                    const productName = product
                      ? product.name
                      : "Menu tidak diketahui";

                    return (
                      <SellerReviewCard
                        key={review.id}
                        review={review}
                        productName={productName}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
