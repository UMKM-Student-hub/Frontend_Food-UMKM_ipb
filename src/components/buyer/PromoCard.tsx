import { Component } from "react";
import { Link } from "react-router-dom";
import type { Promotion } from "../../domain/Promotion";
import { DiscountType } from "../../domain/enums";

interface PromoCardProps {
  promo: Promotion;
  expiryLabel: string;
}

export class PromoCard extends Component<PromoCardProps> {
  private formatDiscount(): string {
    const { promo } = this.props;

    if (promo.discount_type === DiscountType.PERCENTAGE) {
      return `${promo.discount_value}%`;
    }

    return `Rp${Number(promo.discount_value).toLocaleString("id-ID")}`;
  }

  private getFullImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    return path.startsWith("/") ? `http://localhost:8000${path}` : path;
  }

  render() {
    const { promo, expiryLabel } = this.props;
    const photoUrl = this.getFullImageUrl(promo.photo_url);

    return (
      <Link
        to={`/catalog/${promo.umkm_id}?highlight=${promo.menu_item_id}`}
        className="flex w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full"
      >
        <div className="relative h-40 md:h-48 w-full overflow-hidden shrink-0 bg-gray-50">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={promo.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.outerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform duration-500 ease-in-out"><span class="text-gray-400 font-bold text-xs uppercase px-4 text-center tracking-wider">Tanpa Gambar</span></div>`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform duration-500 ease-in-out">
              <span className="text-gray-400 font-bold text-xs uppercase px-4 text-center tracking-wider">
                Tanpa Gambar
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 bg-[#FFB20E] text-[#1B2B65] font-black text-xl md:text-2xl px-4 py-1.5 rounded-tr-2xl drop-shadow-md z-10">
            {this.formatDiscount()}
          </div>
        </div>

        <div className="p-4 md:p-5 flex flex-col grow items-start bg-white justify-between gap-3">
          <div className="w-full">
            <h3 className="text-[#1B2B65] font-extrabold text-base md:text-lg leading-snug line-clamp-2 w-full group-hover:text-[#FFB20E] transition-colors">
              {promo.name}
            </h3>

            <div className="mt-2 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md w-fit border border-blue-100">
              ✓ Berlaku Khusus Menu Pilihan
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 mt-1">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-semibold">{expiryLabel}</span>
          </div>
        </div>
      </Link>
    );
  }
}
