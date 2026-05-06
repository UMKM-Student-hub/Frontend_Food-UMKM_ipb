import React, { Component } from 'react';

// Sesuaikan path ini dengan struktur folder aslimu
import type{ Promotion } from '../../domain/Promotion';
import type { DiscountType } from '../../domain/enums';

interface PromoCardProps {
  promo: Promotion;
  expiryLabel: string;
}

export class PromoCard extends Component<PromoCardProps> {
  
  // Method untuk memformat teks diskon berdasarkan tipe (Persentase vs Nominal Rupiah)
  private formatDiscount(): string {
    const { promo } = this.props;
    
    if (promo.discount_type === DiscountType.PERCENTAGE) {
      return `${promo.discount_value}%`;
    }
    
    // Jika NOMINAL, format ke dalam standar Rupiah
    return `Rp${promo.discount_value.toLocaleString('id-ID')}`;
  }

  render() {
    const { promo, expiryLabel } = this.props;

    // Menggunakan photo_url dari entitas backend.
    // Jika null (belum ada foto), gunakan gambar placeholder.
    const fallbackImage = "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400";
    const displayImage = promo.photo_url || fallbackImage;

    return (
      <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group cursor-pointer">
        
        {/* Bagian Atas: Gambar dan Badge Diskon */}
        <div className="relative h-40 md:h-48 w-full overflow-hidden">
          <img 
            src={displayImage} 
            alt={promo.name} 
            // Efek zoom-in perlahan pada gambar saat card di-hover
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
          
          {/* Badge Diskon (Posisi Kiri Bawah Gambar sesuai desain) */}
          <div className="absolute bottom-0 left-0 bg-[#FFA800] text-white font-extrabold text-2xl md:text-3xl px-4 py-1 rounded-tr-xl drop-shadow-md">
            {this.formatDiscount()}
          </div>
        </div>

        {/* Bagian Bawah: Informasi Promo */}
        <div className="p-4 flex flex-col items-start bg-white">
          
          {/* Nama Produk / Promo */}
          <h3 className="text-gray-800 font-bold text-lg md:text-xl mb-3 truncate w-full">
            {promo.name}
          </h3>
          
          {/* Badge Sisa Waktu (Warna soft orange dengan teks dark orange) */}
          <div className="bg-[#FDECE2] text-[#C05020] font-bold text-sm px-3 py-1.5 rounded-md">
            {expiryLabel}
          </div>

        </div>
        
      </div>
    );
  }
}