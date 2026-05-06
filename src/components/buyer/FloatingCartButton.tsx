import { Component } from 'react';

interface FloatingCartButtonProps {
  totalItems: number; // Jumlah total item untuk ditampilkan di badge
  onClick: () => void; // Fungsi untuk membuka modal/pop-up yang sudah kamu buat
}

export class FloatingCartButton extends Component<FloatingCartButtonProps> {
  render() {
    const { totalItems, onClick } = this.props;

    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Lihat Keranjang Belanja" // Best practice: Aksesibilitas
        className={`
          /* Posisi Tetap (Fixed) di Pojok Kanan Bawah */
          fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 
          
          /* Layout & Sizing */
          w-16 h-16 flex items-center justify-center rounded-full 
          
          /* Warna sesuai gambar referensi */
          bg-[#1E3A8A] text-white shadow-2xl
          
          /* Interaksi & Animasi */
          transition-transform duration-200 ease-in-out
          hover:scale-110 active:scale-95 cursor-pointer
          focus:outline-none focus:ring-4 focus:ring-[#FBBF24]/50
        `}
      >
        {/* Lencana (Badge) Jumlah Item (Hanya muncul jika ada barang) */}
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#FBBF24] text-[#1E3A8A] text-sm font-black w-7 h-7 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {totalItems}
          </span>
        )}
        
        {/* Ikon Keranjang SVG (Putih, mirip gambar referensi image_4b3c1c.png) */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-8 h-8" 
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
    );
  }
}