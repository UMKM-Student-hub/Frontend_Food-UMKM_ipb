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
        to={`/catalog/${promo.umkm_id}`}
        className="flex w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full"
      >
        <div className="relative h-40 md:h-48 w-full overflow-hidden bg-gray-50 shrink-0">
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
          <h3 className="text-[#1B2B65] font-extrabold text-base md:text-lg leading-snug line-clamp-2 w-full group-hover:text-[#FFB20E] transition-colors">
            {promo.name}
          </h3>
          <div className="bg-red-50 text-red-600 border border-red-100 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap">
            {expiryLabel}
          </div>
        </div>
      </Link>
    );
  }
}
