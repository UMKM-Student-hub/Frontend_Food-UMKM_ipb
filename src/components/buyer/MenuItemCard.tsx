import { Component } from "react";
import type { MouseEvent } from "react";
import type { MenuItem } from "../../domain/MenuItem";
import { DiscountType } from "../../domain/enums";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onCardClick?: (item: MenuItem) => void;
}

interface MenuItemCardState {
  quantity: number;
}

export class MenuItemCard extends Component<
  MenuItemCardProps,
  MenuItemCardState
> {
  constructor(props: MenuItemCardProps) {
    super(props);
    this.state = {
      quantity: 1,
    };
  }

  private getDiscountedPrice(item: MenuItem): number {
    if (!item.active_promo) return item.price;
    const promo = item.active_promo;
    if (promo.discount_type === DiscountType.PERCENTAGE) {
      return item.price - (item.price * promo.discount_value) / 100;
    }
    return Math.max(0, item.price - promo.discount_value);
  }

  private handleIncrement = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    const { item } = this.props;
    this.setState((prevState) => ({
      quantity:
        prevState.quantity < item.stock
          ? prevState.quantity + 1
          : prevState.quantity,
    }));
  };

  private handleDecrement = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    this.setState((prevState) => ({
      quantity: prevState.quantity > 1 ? prevState.quantity - 1 : 1,
    }));
  };

  private handleAddToCart = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    const { item, onAddToCart } = this.props;
    const { quantity } = this.state;

    if (item.stock > 0 && item.is_active) {
      onAddToCart(item, quantity);
      this.setState({ quantity: 1 });
    }
  };

  private handleCardClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const { item, onCardClick } = this.props;
    if (onCardClick) {
      onCardClick(item);
    }
  };

  private getFullImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    return path.startsWith("/") ? `http://localhost:8000${path}` : path;
  }

  render() {
    const { item, onCardClick } = this.props;
    const { quantity } = this.state;

    const isOutOfStock = item.stock === 0;
    const isUnavailable = !item.is_active || isOutOfStock;

    const rawPhotoUrl = (item as any).photo_url || (item as any).photoUrl;
    const photoUrl = this.getFullImageUrl(rawPhotoUrl);

    const finalPrice = this.getDiscountedPrice(item);
    const hasPromo = !!item.active_promo;

    return (
      <div
        onClick={this.handleCardClick}
        className={`
          flex flex-col w-full h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm group
          transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#FFB20E]
          ${isUnavailable ? "opacity-60 grayscale" : ""}
          ${onCardClick && !isUnavailable ? "cursor-pointer" : ""}
        `}
      >
        <div className="relative h-40 sm:h-48 w-full bg-gray-50 overflow-hidden shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.outerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform duration-500"><span class="text-gray-400 font-bold text-xs uppercase px-4 text-center tracking-wider">Tanpa Gambar</span></div>`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform duration-500">
              <span className="text-gray-400 font-bold text-xs uppercase px-4 text-center tracking-wider">
                Tanpa Gambar
              </span>
            </div>
          )}

          {hasPromo && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-md text-[10px] font-black shadow-sm uppercase tracking-widest z-10">
              Diskon Aktif!
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-sm uppercase tracking-widest z-10">
              Habis
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 grow flex flex-col items-start justify-between">
          <div className="w-full">
            <div className="flex justify-between items-start mb-2 gap-2">
              <h3
                className="text-[#1B2B65] font-extrabold text-lg leading-snug line-clamp-2 group-hover:text-[#FFB20E] transition-colors"
                title={item.name}
              >
                {item.name}
              </h3>
            </div>
            <p
              className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4"
              title={item.description}
            >
              {item.description || "Menu lezat pilihan dari kantin favoritmu."}
            </p>
          </div>

          <div className="mt-auto flex flex-col">
            {hasPromo ? (
              <>
                <span className="text-gray-400 line-through text-xs font-semibold mb-0.5">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </span>
                <span className="text-[#FFB20E] font-black text-xl">
                  Rp {Number(finalPrice).toLocaleString("id-ID")}
                </span>
              </>
            ) : (
              <span className="text-[#FFB20E] font-black text-xl">
                Rp {Number(item.price).toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center p-4 pt-0 bg-white">
          <div
            className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-1.5 py-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={this.handleDecrement}
              disabled={quantity <= 1 || isUnavailable}
              aria-label="Kurangi jumlah"
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white rounded-full transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 outline-none"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M20 12H4"
                />
              </svg>
            </button>

            <span className="text-[#1B2B65] font-bold w-7 text-center select-none text-sm">
              {quantity}
            </span>

            <button
              onClick={this.handleIncrement}
              disabled={quantity >= item.stock || isUnavailable}
              aria-label="Tambah jumlah"
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-white rounded-full transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 outline-none"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={this.handleAddToCart}
            disabled={isUnavailable}
            aria-label="Tambah ke keranjang"
            className="bg-[#1B2B65] text-white rounded-full w-12 h-12 flex items-center justify-center focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#102A71] hover:shadow-lg transition-all active:scale-90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
    );
  }
}
