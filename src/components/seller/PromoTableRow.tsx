import { Component } from "react";
import type { Promotion } from "../../domain/Promotion";
import { DiscountType } from "../../domain/enums";

interface PromoTableRowProps {
  promo: Promotion;
  onDeactivate: (id: number) => void;
}

export class PromoTableRow extends Component<PromoTableRowProps> {
  // Format angka ke Rupiah
  private formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Format tanggal agar lebih mudah dibaca (Contoh: 12 Agu 2026)
  private formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  render() {
    const { promo, onDeactivate } = this.props;

    // Logika Adaptif Tampilan Diskon
    const discountLabel =
      promo.discount_type === DiscountType.PERCENTAGE
        ? `Diskon ${promo.discount_value}%`
        : `Potongan ${this.formatRupiah(promo.discount_value)}`;

    // Menentukan status berdasarkan masa berlaku dan is_active
    const now = new Date();
    const endDate = new Date(promo.end_date);
    const isExpired = endDate < now;
    const isActuallyActive = promo.is_active && !isExpired;

    return (
      <tr
        className={`border-b border-gray-100 transition-colors bg-white ${isActuallyActive ? "hover:bg-gray-50/50" : "opacity-60 bg-gray-50"}`}
      >
        {/* Kolom Foto Produk Promo */}
        <td className="py-4 px-6">
          <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm relative">
            {promo.photo_url ? (
              <img
                src={promo.photo_url}
                alt={promo.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-xs font-medium">
                No Image
              </span>
            )}

            {/* Tanda jika promo sudah tidak aktif */}
            {!isActuallyActive && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">
                  INAKTIF
                </span>
              </div>
            )}
          </div>
        </td>

        {/* Kolom Nama Promo & Nama Produk */}
        <td className="py-4 px-6">
          <p className="font-bold text-[#1B2B65] text-lg">{promo.name}</p>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Produk ID: {promo.menu_item_id}
          </p>
        </td>

        {/* Kolom Info Diskon */}
        <td className="py-4 px-6">
          <span className="bg-[#FFD13B]/20 text-[#1B2B65] font-bold px-3 py-1 rounded-md border border-[#FFD13B]/50">
            {discountLabel}
          </span>
        </td>

        {/* Kolom Masa Berlaku */}
        <td className="py-4 px-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-800 font-medium">
              {this.formatDate(promo.start_date)} -{" "}
              {this.formatDate(promo.end_date)}
            </span>
            {isExpired && (
              <span className="text-xs text-red-500 font-semibold mt-1">
                Kedaluwarsa
              </span>
            )}
          </div>
        </td>

        {/* Kolom Action */}
        <td className="py-4 px-6 text-center">
          <div className="flex items-center justify-center gap-2">
            {/* Hanya tampilkan tombol Matikan Promo jika promo masih aktif secara sistem */}
            {isActuallyActive ? (
              <button
                onClick={() => onDeactivate(promo.id)}
                className="p-2 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors flex items-center gap-2"
                title="Nonaktifkan Promo"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-semibold hidden md:inline">
                  Matikan
                </span>
              </button>
            ) : (
              <span className="text-gray-400 text-sm font-medium italic">
                Tidak Aktif
              </span>
            )}
          </div>
        </td>
      </tr>
    );
  }
}
