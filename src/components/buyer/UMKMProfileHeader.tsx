import React, { Component } from 'react';
import type { UMKM } from '../../domain/UMKM';

interface UMKMProfileHeaderProps {
  umkm: UMKM | null; // Null saat masih proses fetch dari API
  averageRating: number | null;
  reviewCount?: number; // Opsional: Jumlah ulasan
  onReviewClick?: () => void; // Delegasi untuk pindah ke tab ulasan
}

export class UMKMProfileHeader extends Component<UMKMProfileHeaderProps> {
  
  // Format rating menjadi koma sesuai lokalisasi Indonesia (misal: 4.5 -> 4,5)
  private formatRating(rating: number | null): string {
    if (rating === null || rating === 0) return '0';
    return rating.toLocaleString('id-ID', { maximumFractionDigits: 1 });
  }

  render() {
    const { umkm, averageRating, reviewCount, onReviewClick } = this.props;

    // Jika data UMKM belum tersedia (Loading State / Skeleton)
    if (!umkm) {
      return (
        <div className="flex flex-col md:flex-row justify-between w-full p-6 border-b border-gray-200 animate-pulse bg-white">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="space-y-2 mt-4">
              <div className="h-3 bg-slate-200 rounded"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-8 flex flex-col items-end space-y-3">
            <div className="h-12 bg-slate-200 rounded w-32"></div>
            <div className="h-4 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col md:flex-row justify-between items-start w-full py-8 border-b border-gray-200 bg-white">
        
        {/* Bagian Kiri: Info Kantin */}
        <div className="flex-1 pr-0 md:pr-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#132043] tracking-tight">
              {umkm.name}
            </h1>
            {/* Status Badge: Sangat krusial untuk UX pembeli */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              umkm.isOpen 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {umkm.isOpen ? 'Buka' : 'Tutup'}
            </span>
          </div>
          
          <h2 className="text-lg md:text-xl text-[#132043] font-medium mb-3">
            {umkm.location}
          </h2>
          
          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-3xl">
            {umkm.description}
          </p>
        </div>

        {/* Bagian Kanan: Rating & Ulasan */}
        <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end shrink-0">
          <div className="flex items-start">
            <span className="text-5xl md:text-6xl font-extrabold text-[#132043] tracking-tighter">
              {this.formatRating(averageRating)}
            </span>
            <span className="text-3xl md:text-4xl font-bold text-[#132043] mt-2 ml-1">
              /5
            </span>
            
            {/* Ikon Sparkles SVG custom menyesuaikan mockup */}
            <div className="ml-2 mt-1 flex text-yellow-400">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                 <path d="M19 2L19.8 4.2L22 5L19.8 5.8L19 8L18.2 5.8L16 5L18.2 4.2L19 2Z" className="opacity-70" />
               </svg>
            </div>
          </div>
          
          <button 
            onClick={onReviewClick}
            className="text-slate-500 text-sm font-medium hover:text-[#132043] hover:underline transition-colors mt-1 focus:outline-none"
            aria-label={`Lihat ${reviewCount || 0} ulasan`}
          >
            {reviewCount ? `${reviewCount} ` : ''}Ulasan
          </button>
        </div>

      </div>
    );
  }
}