import { Component } from "react";
import type { MenuItem } from "../../domain/MenuItem";
import { DiscountType } from "../../domain/enums";

interface DetailProdukProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, note: string) => void;
}

interface DetailProdukState {
  quantity: number;
  note: string;
}

export class DetailProduk extends Component<
  DetailProdukProps,
  DetailProdukState
> {
  constructor(props: DetailProdukProps) {
    super(props);
    this.state = { quantity: 1, note: "" };
  }

  componentDidUpdate(prevProps: DetailProdukProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.setState({ quantity: 1, note: "" });
    }
  }

  private getDiscountedPrice(item: MenuItem): number {
    if (!item.active_promo) return item.price;

    const promo = item.active_promo;
    if (promo.discount_type === DiscountType.PERCENTAGE) {
      return item.price - (item.price * promo.discount_value) / 100;
    }
    return Math.max(0, item.price - promo.discount_value);
  }

  private handleIncrement = (): void => {
    const { item } = this.props;
    if (!item) return;
    this.setState((prev) => ({
      quantity: prev.quantity < item.stock ? prev.quantity + 1 : prev.quantity,
    }));
  };

  private handleDecrement = (): void => {
    this.setState((prev) => ({
      quantity: prev.quantity > 1 ? prev.quantity - 1 : 1,
    }));
  };

  private handleAddToCart = (): void => {
    const { item, onAddToCart } = this.props;
    if (item) {
      onAddToCart(item, this.state.quantity, this.state.note);
      this.props.onClose();
    }
  };

  private formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "Rp ");
  }

  private getFullImageUrl(path: string | null): string | null {
    if (!path) return null;
    return path.startsWith("/") ? `http://localhost:8000${path}` : path;
  }

  render() {
    const { item, isOpen, onClose } = this.props;
    const { quantity, note } = this.state;

    if (!isOpen || !item) return null;

    const photoUrl = this.getFullImageUrl(item.photo_url);
    const isUnavailable = item.stock === 0 || !item.is_active;

    const finalPrice = this.getDiscountedPrice(item);
    const subtotal = finalPrice * quantity;
    const hasPromo = !!item.active_promo;

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
        <div
          className="absolute inset-0 bg-[#1B2B65]/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="bg-white w-full sm:w-[500px] max-h-[90vh] sm:rounded-3xl rounded-t-3xl shadow-2xl relative z-10 flex flex-col animate-slideUp sm:animate-scaleIn overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors z-20"
          >
            <svg
              className="w-5 h-5"
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

          <div className="w-full h-56 sm:h-64 bg-gray-100 relative shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.outerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100"><span class="text-gray-400 font-bold tracking-widest text-sm">NO IMAGE</span></div>`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 font-bold tracking-widest text-sm">
                  NO IMAGE
                </span>
              </div>
            )}

            {hasPromo && (
              <div className="absolute top-4 left-4 bg-red-500 text-white font-black px-3 py-1.5 rounded-lg shadow-md text-sm">
                Diskon Aktif!
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col flex-1 overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black text-[#1B2B65] mb-2 leading-tight">
              {item.name}
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {item.description || "Tidak ada deskripsi untuk menu ini."}
            </p>

            <div className="mb-6 flex items-end gap-3">
              {hasPromo ? (
                <div className="flex flex-col">
                  <span className="text-gray-400 line-through text-sm font-semibold mb-0.5">
                    {this.formatRupiah(item.price)}
                  </span>
                  <span className="text-[#FFB20E] font-black text-3xl">
                    {this.formatRupiah(finalPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-[#FFB20E] font-black text-3xl">
                  {this.formatRupiah(item.price)}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-[#1B2B65] font-extrabold text-sm mb-2">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                value={note}
                onChange={(e) => this.setState({ note: e.target.value })}
                placeholder="Contoh: Jangan terlalu pedas ya..."
                className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFB20E] focus:bg-white transition-colors resize-none"
                rows={2}
              />
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-white border-t border-gray-100 flex items-center gap-4 shrink-0">
            <div className="flex items-center bg-gray-100 rounded-full px-1 py-1">
              <button
                onClick={this.handleDecrement}
                disabled={quantity <= 1 || isUnavailable}
                className="w-10 h-10 flex items-center justify-center text-[#1B2B65] font-black text-2xl hover:bg-white rounded-full transition-all disabled:opacity-30 outline-none pb-1"
              >
                -
              </button>
              <span className="font-bold w-10 text-center text-xl select-none">
                {quantity}
              </span>
              <button
                onClick={this.handleIncrement}
                disabled={quantity >= item.stock || isUnavailable}
                className="w-10 h-10 flex items-center justify-center text-[#1B2B65] font-black text-2xl hover:bg-white rounded-full transition-all disabled:opacity-30 outline-none pb-1"
              >
                +
              </button>
            </div>

            <button
              onClick={this.handleAddToCart}
              disabled={isUnavailable}
              className="flex-1 bg-[#1B2B65] hover:bg-[#102A71] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full h-12 sm:h-14 flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none shrink-0 px-4"
            >
              <span className="font-bold text-sm sm:text-base">
                {isUnavailable
                  ? "Stok Habis"
                  : `Tambah - ${this.formatRupiah(subtotal)}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
