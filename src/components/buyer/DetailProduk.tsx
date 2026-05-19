import { Component } from "react";
import type { MenuItem } from "../../domain/MenuItem";

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
    const { item, onAddToCart, onClose } = this.props;
    const { quantity, note } = this.state;
    if (item && item.stock > 0 && item.is_active) {
      onAddToCart(item, quantity, note);
      onClose();
    }
  };

  private formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(price);
  }

  private getFullImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    return path.startsWith("/") ? `http://localhost:8000${path}` : path;
  }

  render() {
    const { item, isOpen, onClose } = this.props;
    const { quantity, note } = this.state;

    if (!isOpen || !item) return null;

    const isOutOfStock = item.stock === 0;
    const isUnavailable = !item.is_active || isOutOfStock;
    const rawPhotoUrl = (item as any).photo_url || (item as any).photoUrl;
    const photoUrl = this.getFullImageUrl(rawPhotoUrl);

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity"
        style={{
          backgroundColor: "rgba(27, 43, 101, 0.6)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      >
        <div
          className="bg-white w-full sm:max-w-xl rounded-[2rem] shadow-2xl flex flex-col relative animate-slideUp sm:animate-fadeIn p-6 md:p-8"
          style={{
            maxHeight: "90vh",
            overflowY: "auto",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-[#1B2B65] transition-colors focus:outline-none z-10 bg-white/80 rounded-full p-1"
          >
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="w-full aspect-4/3 md:h-72 shrink-0 rounded-3xl overflow-hidden bg-gray-50 relative shadow-sm">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.outerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100"><span class="text-gray-400 font-bold text-sm uppercase tracking-wider">Tanpa Gambar</span></div>`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">
                  Tanpa Gambar
                </span>
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md">
                Habis
              </div>
            )}
          </div>

          <div className="text-center my-6">
            <span className="text-4xl md:text-5xl font-extrabold text-[#FFB20E]">
              {this.formatPrice(item.price)}
            </span>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B2B65]">
              {item.name}
            </h2>
            <p className="text-[#1B2B65]/70 text-base md:text-lg font-medium leading-relaxed">
              {item.description ||
                "Hidangan lezat pilihan dari kantin favoritmu."}
            </p>
            <p className="text-[#1B2B65] font-medium text-base mt-1 mb-2">
              Stok : {item.stock}
            </p>

            <div className="w-full">
              <label className="block text-[#1B2B65] text-sm font-bold mb-2">
                Catatan Pesanan (Opsional)
              </label>
              <textarea
                value={note}
                onChange={(e) => this.setState({ note: e.target.value })}
                placeholder="Contoh: Ekstra pedas, jangan pakai bawang, dll."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1B2B65] text-sm focus:outline-none focus:border-[#FFB20E] transition-all resize-none h-20"
              />
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-end gap-5">
            <div className="flex items-center border-2 border-[#1B2B65] rounded-full px-2 py-1.5 bg-white">
              <button
                onClick={this.handleDecrement}
                disabled={quantity <= 1 || isUnavailable}
                className="w-10 h-10 flex items-center justify-center text-[#FFB20E] font-black text-3xl hover:bg-gray-50 rounded-full transition-all disabled:opacity-30 outline-none pb-1"
              >
                −
              </button>
              <span className="text-[#1B2B65] font-bold w-10 text-center text-xl select-none">
                {quantity}
              </span>
              <button
                onClick={this.handleIncrement}
                disabled={quantity >= item.stock || isUnavailable}
                className="w-10 h-10 flex items-center justify-center text-[#FFB20E] font-black text-3xl hover:bg-gray-50 rounded-full transition-all disabled:opacity-30 outline-none pb-1"
              >
                +
              </button>
            </div>

            <button
              onClick={this.handleAddToCart}
              disabled={isUnavailable}
              className="bg-[#FFB20E] hover:bg-[#F0A500] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed text-[#1B2B65] rounded-full w-16 h-16 flex items-center justify-center transition-all shadow-md focus:outline-none shrink-0"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
