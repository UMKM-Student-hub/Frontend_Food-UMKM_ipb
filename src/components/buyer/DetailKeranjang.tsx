import React, { Component } from 'react';
import type { MenuItem } from '../../domain/MenuItem';

// Tipe data untuk item di keranjang
export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface DetailKeranjangProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onCheckout: () => void;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
}

export class DetailKeranjang extends Component<DetailKeranjangProps> {
  private formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  }

  private getTotalPrice(): number {
    return this.props.cartItems.reduce(
      (total, ci) => total + ci.item.price * ci.quantity,
      0
    );
  }

  private getTotalItems(): number {
    return this.props.cartItems.reduce((total, ci) => total + ci.quantity, 0);
  }

  render() {
    const { isOpen, cartItems, onClose, onCheckout, onUpdateQuantity, onRemoveItem } = this.props;

    if (!isOpen) return null;

    const totalItems = this.getTotalItems();
    const totalPrice = this.getTotalPrice();

    return (
      // Overlay
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        {/* Modal Panel */}
        <div
          className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{ maxHeight: '85vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Keranjang */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-[#132043] rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#fca311]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#132043]">Keranjang Pesanan</h2>
                <p className="text-xs text-slate-400">{totalItems} item dipilih</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
              aria-label="Tutup keranjang"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* List Item */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-slate-500 font-medium text-base">Keranjang masih kosong</p>
                <p className="text-slate-400 text-sm mt-1">Tambahkan menu favoritmu!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
                  >
                    {/* Gambar */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={item.photo_url || '/assets/default-food.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#132043] text-sm truncate">{item.name}</p>
                      <p className="text-[#fca311] font-bold text-sm mt-0.5">
                        {this.formatPrice(item.price)}
                      </p>
                      {/* Subtotal per item */}
                      <p className="text-slate-400 text-xs mt-0.5">
                        Subtotal: {this.formatPrice(item.price * quantity)}
                      </p>
                    </div>

                    {/* Kontrol Qty */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {/* Tombol Hapus */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors focus:outline-none"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      {/* Qty Counter */}
                      <div className="flex items-center border-2 border-[#132043] rounded-full px-1.5 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="text-[#fca311] font-bold px-1.5 text-base focus:outline-none disabled:text-gray-300 disabled:cursor-not-allowed"
                          aria-label="Kurangi"
                        >
                          −
                        </button>
                        <span className="text-[#132043] font-bold w-6 text-center text-sm select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                          disabled={quantity >= item.stock}
                          className="text-[#fca311] font-bold px-1.5 text-base focus:outline-none disabled:text-gray-300 disabled:cursor-not-allowed"
                          aria-label="Tambah"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer: Total + Checkout */}
          {cartItems.length > 0 && (
            <div className="px-5 pt-4 pb-6 border-t border-gray-100 flex-shrink-0 bg-white">
              {/* Rincian Harga */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 text-sm">Total ({totalItems} item)</span>
                <span className="text-[#132043] font-extrabold text-lg">
                  {this.formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">*Harga belum termasuk biaya layanan</p>

              {/* Tombol Checkout */}
              <button
                onClick={onCheckout}
                className="w-full bg-[#fca311] hover:bg-[#e8940f] active:scale-95 text-[#132043] font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                Pesan Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}