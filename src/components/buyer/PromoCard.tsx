import React, { Component } from 'react';
import { Link } from 'react-router-dom'; // Tambahkan import Link

import type { Promotion } from '../../domain/Promotion';
import { DiscountType } from '../../domain/enums'; // Pastikan path-nya sesuai

interface PromoCardProps {
  promo: Promotion;
  expiryLabel: string;
}

export class PromoCard extends Component<PromoCardProps> {
  
  // Method untuk memformat teks diskon berdasarkan tipe
  private formatDiscount(): string {
    const { promo } = this.props;
    
    // Penanganan aman untuk snake_case maupun camelCase dari API
    const discountType = (promo as any).discount_type || promo.discountType;
    const discountValue = (promo as any).discount_value || promo.discountValue;
    
    if (discountType === DiscountType.PERCENTAGE) {
      return `${discountValue}%`;
    }
    
    return `Rp${discountValue.toLocaleString('id-ID')}`;
  }

  render() {
    const { promo, expiryLabel } = this.props;

    // Mendapatkan ID Kantin dan URL Foto (dukungan camelCase & snake_case)
    const umkmId = (promo as any).umkm_id || promo.umkmId;
    const photoUrl = (promo as any).photo_url || (promo as any).photoUrl;

    return (
      // 1. Ubah div luar menjadi Link agar seluruh card bisa diklik menuju ProductDetailPage
      <Link 
        to={`/catalog/${umkmId}`} 
        className="block w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer"
      >
        
        {/* Bagian Atas: Gambar dan Badge Diskon */}
        <div className="relative h-40 md:h-48 w-full overflow-hidden bg-[#F8F9FA]">
          
          {/* 2. Logika Pengecekan Foto Promo */}
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt={promo.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
          ) : (
            // Jika foto tidak ada, tampilkan placeholder abu-abu ini
            <div className="w-full h-full flex items-center justify-center bg-gray-200 group-hover:scale-110 transition-transform duration-500 ease-in-out">
              <span className="text-gray-500 font-medium text-sm px-4 text-center">
                Gambar belum tersedia
              </span>
            </div>
          )}
          
          {/* Badge Diskon (Tetap Tampil Walau Gambar Tidak Ada) */}
          <div className="absolute bottom-0 left-0 bg-[#FFA800] text-white font-extrabold text-2xl md:text-3xl px-4 py-1 rounded-tr-xl drop-shadow-md z-10">
            {this.formatDiscount()}
          </div>
        </div>

        {/* Bagian Bawah: Informasi Promo */}
        <div className="p-4 flex flex-col items-start bg-white">
          
          {/* Nama Promo */}
          <h3 className="text-gray-800 font-bold text-lg md:text-xl mb-3 truncate w-full">
            {promo.name}
          </h3>
          
          {/* Badge Sisa Waktu */}
          <div className="bg-[#FDECE2] text-[#C05020] font-bold text-sm px-3 py-1.5 rounded-md">
            {expiryLabel}
          </div>

        </div>
      </Link>
    );
  }
}