import { Component } from "react";
import type { UMKM } from "../../domain/UMKM";

interface UMKMProfileHeaderProps {
  umkm: UMKM | null;
  averageRating: number | null;
  reviewCount?: number;
  onReviewClick?: () => void;
}

export class UMKMProfileHeader extends Component<UMKMProfileHeaderProps> {
  private formatRating(rating: number | null): string {
    if (rating === null || rating === 0) return "0";
    return rating.toLocaleString("id-ID", { maximumFractionDigits: 1 });
  }

  render() {
    const { umkm, averageRating, reviewCount, onReviewClick } = this.props;

    if (!umkm) {
      return (
        <div className="flex flex-col md:flex-row justify-between w-full py-8 border-b border-gray-100 animate-pulse bg-transparent">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-10 md:h-12 bg-gray-200 rounded-xl w-3/4"></div>
            <div className="h-5 md:h-6 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-8 flex flex-col items-start md:items-end space-y-3">
            <div className="h-14 md:h-16 bg-gray-200 rounded-xl w-32"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      );
    }

    const isOpen = (umkm as any).is_open ?? umkm.isOpen ?? false;

    return (
      <div className="flex flex-col md:flex-row justify-between items-start w-full py-6 md:py-10 border-b border-gray-100 bg-transparent gap-6 md:gap-8">
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-5xl font-black text-[#1B2B65] tracking-tight">
              {umkm.name}
            </h1>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                isOpen
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {isOpen ? "Buka" : "Tutup"}
            </span>
          </div>

          <h2 className="text-base md:text-xl text-gray-500 font-bold mb-4">
            {umkm.location}
          </h2>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl font-medium">
            {umkm.description}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end shrink-0 bg-gray-50 p-4 md:p-6 rounded-3xl border border-gray-100 w-full md:w-auto">
          <div className="flex items-center">
            <span className="text-5xl md:text-6xl font-black text-[#1B2B65] tracking-tighter">
              {this.formatRating(averageRating)}
            </span>
            <span className="text-2xl md:text-3xl font-bold text-gray-400 mt-2 ml-1">
              /5
            </span>
            <div className="ml-3 flex text-[#FFB20E]">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                <path
                  d="M19 2L19.8 4.2L22 5L19.8 5.8L19 8L18.2 5.8L16 5L18.2 4.2L19 2Z"
                  className="opacity-60"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={onReviewClick}
            className="text-gray-500 text-sm md:text-base font-bold hover:text-[#FFB20E] transition-colors mt-2 focus:outline-none flex items-center gap-1"
            aria-label={`Lihat ${reviewCount || 0} ulasan`}
          >
            {reviewCount ? `${reviewCount} ` : ""}Ulasan Pelanggan
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}
