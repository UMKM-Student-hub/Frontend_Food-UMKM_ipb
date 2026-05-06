import React, { Component } from 'react';
import type { MenuItem } from '../../domain/MenuItem';

interface DetailProdukProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

interface DetailProdukState {
  quantity: number;
}

export class DetailProduk extends Component<DetailProdukProps, DetailProdukState> {
  constructor(props: DetailProdukProps) {
    super(props);
    this.state = { quantity: 1 };
  }

  componentDidUpdate(prevProps: DetailProdukProps) {
    // Reset quantity setiap kali modal dibuka dengan item baru
    if (!prevProps.isOpen && this.props.isOpen) {
      this.setState({ quantity: 1 });
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
    const { quantity } = this.state;
    if (item && item.stock > 0 && item.is_active) {
      onAddToCart(item, quantity);
      onClose();
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
    const { item, isOpen, onClose } = this.props;
    const { quantity } = this.state;

    if (!isOpen || !item) return null;

    const isOutOfStock = item.stock === 0;
    const isUnavailable = !item.is_active || isOutOfStock;

    return (
      // Overlay
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        {/* Modal Panel */}
        <div
          className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
          style={{ maxHeight: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gambar Produk */}
          <div className="relative w-full h-56 sm:h-64 bg-gray-100 flex-shrink-0">
            <img
              src={item.photo_url || '/assets/default-food.jpg'}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* Tombol tutup */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-white transition-colors focus:outline-none"
              aria-label="Tutup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Badge habis */}
            {isOutOfStock && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Habis
              </div>
            )}
            {/* Badge tidak aktif */}
            {!item.is_active && !isOutOfStock && (
              <div className="absolute top-3 left-3 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Tidak Tersedia
              </div>
            )}
          </div>

          {/* Konten */}
          <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 16rem)' }}>
            {/* Nama & Harga */}
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-extrabold text-[#132043] flex-1 pr-3 leading-tight">
                {item.name}
              </h2>
              <span className="text-xl font-extrabold text-[#fca311] whitespace-nowrap">
                Rp {this.formatPrice(item.price)}
              </span>
            </div>

            {/* Kategori */}
            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-[#132043]/10 text-[#132043] mb-3 capitalize">
              {item.category?.toLowerCase() || 'Lainnya'}
            </span>

            {/* Deskripsi */}
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              {item.description || 'Tidak ada deskripsi untuk produk ini.'}
            </p>

            {/* Info Stok */}
            <div className="flex items-center gap-2 mb-5 p-3 bg-gray-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm text-slate-500">
                Stok tersedia:{' '}
                <span className={`font-bold ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {item.stock > 0 ? `${item.stock} porsi` : 'Habis'}
                </span>
              </span>
            </div>

            {/* Kontrol Kuantitas + Tombol Tambah */}
            {!isUnavailable && (
              <div className="flex items-center gap-4">
                {/* Qty Control */}
                <div className="flex items-center border-2 border-[#132043] rounded-full px-3 py-1.5">
                  <button
                    onClick={this.handleDecrement}
                    disabled={quantity <= 1}
                    className="text-[#fca311] text-xl font-bold px-2 focus:outline-none disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                    aria-label="Kurangi"
                  >
                    −
                  </button>
                  <span className="text-[#132043] font-bold w-8 text-center text-base select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={this.handleIncrement}
                    disabled={quantity >= item.stock}
                    className="text-[#fca311] text-xl font-bold px-2 focus:outline-none disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                    aria-label="Tambah"
                  >
                    +
                  </button>
                </div>

                {/* Tombol Tambah ke Keranjang */}
                <button
                  onClick={this.handleAddToCart}
                  className="flex-1 bg-[#132043] hover:bg-[#1a2d5a] active:scale-95 text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Tambah ke Keranjang
                </button>
              </div>
            )}

            {isUnavailable && (
              <div className="text-center py-3 px-4 bg-gray-100 rounded-xl text-slate-400 text-sm font-medium">
                {isOutOfStock ? 'Menu ini sedang habis 😔' : 'Menu ini tidak tersedia saat ini'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}