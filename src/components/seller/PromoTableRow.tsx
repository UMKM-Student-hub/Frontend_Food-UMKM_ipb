import { Component } from "react";
import type { Promotion } from "../../domain/Promotion";
import { DiscountType } from "../../domain/enums";

interface PromoTableRowProps {
  promo: Promotion;
  onDeactivate: (id: number) => void;
}

export class PromoTableRow extends Component<PromoTableRowProps> {
  private formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

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

    const imageUrl = promo.photo_url?.startsWith("/")
      ? `http://localhost:8000${promo.photo_url}`
      : promo.photo_url;

    const discountLabel =
      promo.discount_type === DiscountType.PERCENTAGE
        ? `Diskon ${promo.discount_value}%`
        : `Potongan ${this.formatRupiah(promo.discount_value)}`;

    const isActuallyActive =
      promo.is_active && new Date(promo.end_date) >= new Date();

    return (
      <tr className="block md:table-row border-b border-gray-200 md:border-gray-100 hover:bg-gray-50/50 transition-colors bg-white p-4 md:p-0 mb-4 md:mb-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none">
        <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
          <div className="flex justify-center md:justify-start mb-4 md:mb-0">
            <div className="w-32 h-32 md:w-16 md:h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={promo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </td>

        <td className="flex md:table-cell justify-between items-center py-2 md:py-4 px-2 md:px-6 border-b border-gray-50 md:border-none">
          <span className="md:hidden font-bold text-xs text-gray-500 uppercase tracking-wider">
            Detail Promo
          </span>
          <div className="flex flex-col text-right md:text-left">
            <span className="font-bold text-[#1B2B65] text-lg">
              {promo.name}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              Item ID: {promo.menu_item_id}
            </span>
          </div>
        </td>

        <td className="flex md:table-cell justify-between items-center py-2 md:py-4 px-2 md:px-6 border-b border-gray-50 md:border-none">
          <span className="md:hidden font-bold text-xs text-gray-500 uppercase tracking-wider">
            Diskon
          </span>
          <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 font-bold text-sm border border-green-100">
            {discountLabel}
          </span>
        </td>

        <td className="flex md:table-cell justify-between items-center py-2 md:py-4 px-2 md:px-6 border-b border-gray-50 md:border-none">
          <span className="md:hidden font-bold text-xs text-gray-500 uppercase tracking-wider">
            Periode
          </span>
          <div className="flex flex-col text-sm text-gray-600 text-right md:text-left items-end md:items-start">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              {this.formatDate(promo.start_date)}
            </span>
            <span className="flex items-center gap-1 mt-1 md:mt-0">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              {this.formatDate(promo.end_date)}
            </span>
          </div>
        </td>

        <td className="flex md:table-cell justify-between items-center py-4 md:py-4 px-2 md:px-6 text-center mt-2 md:mt-0">
          <span className="md:hidden font-bold text-xs text-gray-500 uppercase tracking-wider">
            Action
          </span>
          <div className="flex items-center justify-end md:justify-center gap-2">
            {isActuallyActive ? (
              <button
                onClick={() => onDeactivate(promo.id)}
                className="p-2 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
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
                <span className="text-sm font-bold hidden lg:inline">
                  Matikan
                </span>
              </button>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                Expired
              </span>
            )}
          </div>
        </td>
      </tr>
    );
  }
}
