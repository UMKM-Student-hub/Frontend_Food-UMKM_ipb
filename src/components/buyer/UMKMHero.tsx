import React from 'react';
import type { UMKM } from '../../domain/UMKM';

interface UMKMHeroProps {
  // Menerima object UMKM murni dari CatalogService
  umkm?: UMKM; 
  // Menerima rata-rata rating dari ReviewService
  averageRating?: number; 
  // Status loading dari parent (ProductDetailPage)
  isLoading?: boolean; 
}

interface UMKMHeroState {}

export class UMKMHero extends React.Component<UMKMHeroProps, UMKMHeroState> {
  
  // Helper untuk mengubah format angka 4.5 menjadi "4,5" sesuai lokal Indonesia
  private formatRating(rating?: number): string {
    if (rating === undefined || rating === 0) return "-";
    return rating.toString().replace('.', ',');
  }

  render() {
    const { umkm, averageRating, isLoading } = this.props;

    // Menangani state saat data dari API masih dimuat
    if (isLoading || !umkm) {
      return (
        <section className="w-full py-12 px-12 md:py-16 md:px-12 animate-pulse flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col space-y-4 w-full max-w-3xl">
            <div className="h-14 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="h-16 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </section>
      );
    }

    return (
      <section className="w-full bg-transparent py-20 px-12 md:py-16 md:px-24 font-sans">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12">
          
          {/* BAGIAN KIRI: Info UMKM dari Domain */}
          <div className="flex flex-col max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#0D2364] tracking-tight mb-2">
              {umkm.name}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-[#0D2364] mb-3">
              {umkm.location}
            </h2>
            <p className="text-base md:text-lg text-[#3C4D7B] leading-relaxed max-w-2xl">
              {umkm.description}
            </p>
          </div>

          {/* BAGIAN KANAN: Rating & Ulasan */}
          <div className="flex flex-col items-start md:items-end flex-shrink-0">
            <div className="flex items-start md:items-center">
              <span className="text-6xl md:text-7xl font-extrabold text-[#0D2364] tracking-tighter">
                {this.formatRating(averageRating)}
                <span className="text-5xl md:text-6xl font-bold">/5</span>
              </span>
              <span className="text-4xl md:text-5xl ml-2 animate-pulse select-none" aria-hidden="true">
                ✨
              </span>
            </div>
            <span className="text-lg md:text-xl text-[#3C4D7B] font-medium mt-1 md:mt-2">
              Ulasan
            </span>
          </div>

        </div>
      </section>
    );
  }
}