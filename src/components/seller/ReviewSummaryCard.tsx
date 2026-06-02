import { Component } from "react";

interface ReviewSummaryCardProps {
  averageRating: string;
  totalReviews: number;
  ratingCounts: Record<number, number>;
  activeFilter: number | "ALL";
  onFilterChange: (filter: number | "ALL") => void;
}

export class ReviewSummaryCard extends Component<ReviewSummaryCardProps> {
  render() {
    const {
      averageRating,
      totalReviews,
      ratingCounts,
      activeFilter,
      onFilterChange,
    } = this.props;

    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-[#1B2B65] text-lg font-extrabold mb-6">
          Ringkasan Ulasan
        </h3>

        <div className="flex items-center gap-6 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-black text-[#1B2B65] leading-none mb-2">
              {averageRating}
            </span>
            <div className="flex text-[#FFB20E] mb-1">
              <span className="text-xl">★</span>
            </div>
            <span className="text-sm text-gray-400 font-medium">
              {totalReviews} Ulasan
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 border-l border-gray-100 pl-6">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star] || 0;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-600 w-3">
                    {star}
                  </span>
                  <span className="text-[#FFB20E] text-xs">★</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFB20E] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium w-6 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-bold text-[#1B2B65] mb-3">
            Filter Ulasan
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange("ALL")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeFilter === "ALL"
                  ? "bg-[#1B2B65] text-white shadow-md"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Semua
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => onFilterChange(star)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeFilter === star
                    ? "bg-[#1B2B65] text-white shadow-md"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {star} <span className="text-[#FFB20E]">★</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}