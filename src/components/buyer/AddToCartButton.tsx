import { Component } from 'react';

interface AddToCartButtonProps {
  onClick: () => void;
  className?: string; // Untuk fleksibilitas posisi di layout berbeda
}

export class AddToCartButton extends Component<AddToCartButtonProps> {
  render() {
    const { onClick, className } = this.props;

    return (
      <button
        type="button" // Robust: Menghindari pengiriman form secara tidak sengaja
        onClick={onClick}
        aria-label="Tambah ke keranjang" // Best Practice: Aksesibilitas bagi screen reader
        className={`
          /* Layout & Sizing: Responsif untuk jempol pengguna mobile */
          flex items-center justify-center
          w-14 h-14 rounded-full 
          
          /* Colors & Borders: Sesuai mockup UniBites */
          bg-[#1E3A8A] border-4 border-[#FBBF24] 
          shadow-lg transition-all duration-200
          
          /* Interactions: Feedback visual saat disentuh/klik */
          hover:scale-110 active:scale-95 
          cursor-pointer
          
          /* Focus States: Memudahkan navigasi keyboard */
          focus:outline-none focus:ring-4 focus:ring-[#FBBF24]/50
          
          ${className || ''}
        `}
      >
        {/* Menggunakan keranjang.png dengan format path public */}
        <img 
          src="/images/keranjang.png" 
          alt="Cart Icon" 
          className="w-7 h-7 object-contain"
          /* Filter CSS: Memastikan ikon tampil dengan warna kuning UniBites (#FBBF24) */
          style={{ 
            filter: 'invert(82%) sepia(61%) saturate(2123%) hue-rotate(334deg) brightness(101%) contrast(98%)' 
          }}
        />
      </button>
    );
  }
}