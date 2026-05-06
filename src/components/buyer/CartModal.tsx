import React, { Component } from 'react';
import type { CartItem } from '../../domain/Order';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  // Fungsi untuk menambah/mengurangi jumlah item (delta: 1 atau -1)
  onUpdateQuantity: (menuItemId: number, delta: number) => void;
  // Fungsi yang dieksekusi saat tombol "Pesan" ditekan
  onCheckout: (paymentMethod: string) => void;
}

interface CartModalState {
  paymentMethod: string;
}

export class CartModal extends Component<CartModalProps, CartModalState> {
  constructor(props: CartModalProps) {
    super(props);
    this.state = {
      paymentMethod: 'gopay', // Default value
    };
  }

  // Menutup modal jika user mengklik area abu-abu di luar kotak putih
  private handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  private handlePaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ paymentMethod: e.target.value });
  };

  private handleCheckout = () => {
    // Memanggil fungsi dari Parent (misal: CatalogPage) untuk memproses API OrderService
    this.props.onCheckout(this.state.paymentMethod);
  };

  // Kalkulasi total harga secara dinamis
  private calculateTotal(): number {
    return this.props.cartItems.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  }

  render() {
    const { isOpen, cartItems, onUpdateQuantity } = this.props;
    const { paymentMethod } = this.state;

    // Jika state isOpen false, jangan render apa-apa (sembunyikan)
    if (!isOpen) return null;

    const total = this.calculateTotal();

    return (
      // 1. Backdrop (Latar Belakang Gelap transparan)
      <div 
        className="fixed inset-0 bg-[#1B2B65]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity"
        onClick={this.handleBackdropClick}
      >
        {/* 2. Modal Box */}
        <div className="bg-white rounded-[1.5rem] border-[3px] border-[#1B2B65] w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up relative">
          
          {/* Tombol Close 'X' (Opsional tapi disarankan untuk Best Practice UX) */}
          <button 
            onClick={this.props.onClose}
            className="absolute top-4 right-5 text-[#1B2B65] hover:text-red-500 font-bold text-xl transition-colors"
          >
            ✕
          </button>

          <div className="p-6 md:p-8">
            {/* Judul Modal */}
            <h2 className="text-2xl font-extrabold text-[#1B2B65] tracking-wide mb-6">
              KERANJANGKU
            </h2>

            {/* Header Tabel (Item & Harga) */}
            <div className="flex justify-between items-center text-[#1B2B65] font-bold text-lg mb-3 px-1">
              <span>Item</span>
              <span>Harga</span>
            </div>
            
            {/* Garis Pemisah Header */}
            <div className="border-b-2 border-gray-200 mb-4"></div>

            {/* Daftar Item Keranjang */}
            <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4 mb-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-400 py-6 font-medium">
                  Keranjangmu masih kosong. Yuk, jajan dulu!
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between items-center">
                    
                    {/* Nama Item */}
                    <span className="text-[#1B2B65] font-semibold flex-1 truncate pr-2">
                      {item.menuItem.name}
                    </span>

                    {/* Kontrol Kuantitas (Bentuk kapsul) */}
                    <div className="flex items-center justify-between bg-white border-2 border-[#1B2B65] rounded-full px-2 py-0.5 w-24 mr-4">
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                        className="text-[#FFA800] font-bold text-lg hover:scale-110 transition-transform focus:outline-none"
                      >
                        −
                      </button>
                      <span className="text-[#1B2B65] font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                        className="text-[#FFA800] font-bold text-lg hover:scale-110 transition-transform focus:outline-none"
                      >
                        +
                      </button>
                    </div>

                    {/* Harga per Baris (Harga x Kuantitas) */}
                    <span className="text-[#FFA800] font-bold w-20 text-right">
                      {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Garis Pemisah Bawah */}
            <div className="border-b-2 border-gray-200 mb-4"></div>

            {/* Subtotal */}
            <div className="flex justify-end items-center gap-6 mb-8 pr-1">
              <span className="text-[#1B2B65] font-bold text-lg">Subtotal</span>
              <span className="text-[#FFA800] font-extrabold text-xl">
                {total.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Pilihan Pembayaran & Tombol Pesan */}
            {cartItems.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className="text-[#1B2B65] font-semibold text-lg">Pilih Pembayaran</span>
                  
                  {/* Dropdown Pembayaran */}
                  <select 
                    value={paymentMethod}
                    onChange={this.handlePaymentChange}
                    className="border-2 border-[#1B2B65] text-[#1B2B65] font-bold rounded-full px-4 py-1.5 outline-none focus:ring-2 ring-[#FFA800]/50 transition-all appearance-none bg-white cursor-pointer w-full sm:w-auto min-w-[140px] text-center"
                    style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%231B2B65" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
                  >
                    <option value="gopay">Gopay</option>
                    <option value="qris">QRIS</option>
                    <option value="cash">Tunai</option>
                  </select>
                </div>

                {/* Detail Instruksi Pembayaran Khusus (Menyesuaikan desain) */}
                {paymentMethod === 'gopay' && (
                  <div className="text-[#1B2B65] font-medium">
                    Gopay : 0812673839
                  </div>
                )}

                {/* Tombol Pesan */}
                <div className="mt-4 flex justify-center sm:justify-end">
                  <button 
                    onClick={this.handleCheckout}
                    className="bg-[#1B2B65] hover:bg-[#102A71] text-white font-bold text-lg py-2.5 px-12 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 w-full sm:w-auto"
                  >
                    Pesan
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    );
  }
}