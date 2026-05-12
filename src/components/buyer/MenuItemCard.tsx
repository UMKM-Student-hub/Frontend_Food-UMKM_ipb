import React, { Component } from 'react';
import type { MenuItem } from '../../domain/MenuItem';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onCardClick?: (item: MenuItem) => void; // Prop baru untuk membuka DetailProduk
}

interface MenuItemCardState {
  quantity: number;
}

export class MenuItemCard extends Component<MenuItemCardProps, MenuItemCardState> {
  constructor(props: MenuItemCardProps) {
    super(props);
    this.state = {
      quantity: 1,
    };
  }

  private handleIncrement = (e: React.MouseEvent): void => {
    e.stopPropagation(); // Cegah klik kartu terbuka
    const { item } = this.props;
    this.setState((prevState) => ({
      quantity: prevState.quantity < item.stock ? prevState.quantity + 1 : prevState.quantity,
    }));
  };

  private handleDecrement = (e: React.MouseEvent): void => {
    e.stopPropagation();
    this.setState((prevState) => ({
      quantity: prevState.quantity > 1 ? prevState.quantity - 1 : 1,
    }));
  };

  private handleAddToCart = (e: React.MouseEvent): void => {
    e.stopPropagation(); // Cegah propagasi ke kartu
    const { item, onAddToCart } = this.props;
    const { quantity } = this.state;

    if (item.stock > 0 && item.is_active) {
      onAddToCart(item, quantity);
      this.setState({ quantity: 1 });
    }
  };

  private handleCardClick = (): void => {
    const { item, onCardClick } = this.props;
    if (onCardClick) {
      onCardClick(item);
    }
  };

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace('Rp', '')
      .trim();
  }

  render() {
    const { item } = this.props;
    const { quantity } = this.state;

    const isOutOfStock = item.stock === 0;
    const isUnavailable = !item.is_active || isOutOfStock;

    return (
      <div
        onClick={this.handleCardClick}
        className={`
          flex flex-col w-full min-w-[250px] max-w-[300px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm
          transition-all duration-200 hover:-translate-y-1 hover:shadow-md
          ${isUnavailable ? 'opacity-60 grayscale' : ''}
          ${this.props.onCardClick ? 'cursor-pointer' : ''}
        `}
      >
        {/* Gambar Produk */}
        <div className="relative h-44 w-full bg-gray-100">
          <img
            src={item.photo_url || '/assets/default-food.jpg'}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold shadow-sm uppercase tracking-wider">
              Habis
            </div>
          )}
        </div>

        {/* Info Produk */}
        <div className="p-4 flex-grow flex flex-col text-center">
          <p className="text-orange-500 font-bold text-[1.1rem] mb-1">
            {this.formatPrice(item.price)}
          </p>
          <h3 className="text-slate-900 font-bold text-lg mb-1 truncate" title={item.name}>
            {item.name}
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2" title={item.description}>
            {item.description}
          </p>
        </div>

        {/* Aksi & Kuantitas */}
        <div className="flex justify-between items-center p-3 border-t border-gray-100 bg-gray-50/50">
          {/* Kontrol Kuantitas */}
          <div className="flex items-center border-2 border-slate-900 rounded-full px-2 py-0.5 bg-white">
            <button
              onClick={this.handleDecrement}
              disabled={quantity <= 1 || isUnavailable}
              aria-label="Kurangi jumlah"
              className="text-orange-500 text-xl font-medium px-2 pb-0.5 focus:outline-none disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              &minus;
            </button>
            <span className="text-slate-900 font-bold w-6 text-center select-none text-sm">
              {quantity}
            </span>
            <button
              onClick={this.handleIncrement}
              disabled={quantity >= item.stock || isUnavailable}
              aria-label="Tambah jumlah"
              className="text-orange-500 text-xl font-medium px-2 pb-0.5 focus:outline-none disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              &#43;
            </button>
          </div>

          {/* Tombol Keranjang */}
          <button
            onClick={this.handleAddToCart}
            disabled={isUnavailable}
            aria-label="Tambah ke keranjang"
            className="bg-slate-900 text-white rounded-full w-9 h-9 flex items-center justify-center focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-slate-800 hover:shadow-md transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}