import React, { Component } from 'react';

// === Import Components ===
import { HeroHome } from '../../components/buyer/HeroHome';
import { SearchBar } from '../../components/buyer/SearchBar';
import { PromoCard } from '../../components/buyer/PromoCard'; // Sesuaikan path jika diletakkan di common
import { CatalogDashboard } from '../../components/buyer/CatalogDashboard';
import { FeatureBanner } from '../../components/buyer/FeatureBanner';

// === Import Domain & Services ===
import type { Promotion } from '../../domain/Promotion';
import { PromoService } from '../../services/PromoService';

interface CatalogPageState {
  searchKeyword: string;
  promos: Promotion[];
  isLoadingPromos: boolean;
  error: string | null;
}

export default class CatalogPage extends Component<{}, CatalogPageState> {
  private promoService = new PromoService();

  constructor(props: {}) {
    super(props);
    this.state = {
      searchKeyword: '',
      promos: [],
      isLoadingPromos: true,
      error: null,
    };
  }

  async componentDidMount() {
    await this.fetchActivePromos();
  }

  // Pola Wajib: Fetching dengan try-catch-finally
  private async fetchActivePromos(): Promise<void> {
    this.setState({ isLoadingPromos: true, error: null });
    try {
      const data = await this.promoService.listActivePromos();
      this.setState({ promos: data });
    } catch (err: any) {
      this.setState({ error: err.message || 'Gagal memuat promo' });
    } finally {
      this.setState({ isLoadingPromos: false });
    }
  }

  // Handler untuk SearchBar
  private handleSearchChange = (keyword: string): void => {
    this.setState({ searchKeyword: keyword });
    // TODO: Implementasikan logika search, misalnya mengirim event ke CatalogDashboard
  };

  // Helper untuk format sisa hari promo
  private formatExpiry(endDate: string): string {
    const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff <= 0 ? 'Berakhir hari ini' : `${diff} Hari Lagi`;
  }

  render() {
    const { searchKeyword, promos, isLoadingPromos, error } = this.state;

    return (
      <div className="min-h-screen bg-[#FFFCF5] flex flex-col font-sans">
        {/* 1. Navigation Bar */}

        {/* 2. Hero Section */}
        <div className="relative z-10">
        <HeroHome/>
        </div>

        {/* Konten Utama */}
        <main className="flex-grow w-full relative">
          
            {/* 3. Search Bar (Posisi tumpang tindih antara Hero kuning dan background putih) */}
            <div className="relative z-20 px-16 lg:px-16 -mt-7 md:-mt-8">
                <div className="max-w-7xl mx-auto flex justify-start">
                {/* Wadah pembatas lebar Search Bar (60% di tablet, 50% di desktop), sejajar ke kiri */}
                <div className="w-full md:w-3/5 lg:w-1/2">
                    <SearchBar 
                    value={searchKeyword} 
                    onChange={this.handleSearchChange} 
                    />
                </div>
                </div>
            </div>

          {/* 4. Section: Promo & Diskon (Menyesuaikan grid dari gambar) */}
          <section className="max-w-7xl mx-auto px-16 lg:px-16 pt-8 pb-12">
            {isLoadingPromos ? (
              <div className="text-center py-10 text-gray-500 font-semibold">Memuat promo menarik...</div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center mb-6">{error}</div>
            ) : promos.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Belum ada promo aktif saat ini.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Tampilkan maksimal 4 promo teratas di Home */}
                {promos.slice(0, 4).map((promo) => (
                  <PromoCard 
                    key={promo.id} 
                    promo={promo} 
                    expiryLabel={this.formatExpiry(promo.end_date)} 
                  />
                ))}
              </div>
            )}
          </section>

          {/* 5. Section: Catalog Dashboard (Filter & Daftar Kantin) */}
          {/* Menggunakan komponen CatalogDashboard yang sudah mencakup judul "Jajan dari Kantin..." */}
          <CatalogDashboard />

          {/* 6. Section: Feature Banner */}
          <div className="pb-16 pt-8 bg-gradient-to-b from-[#FFFCF5] to-[#FFF3D0]">
            <FeatureBanner />
          </div>

        </main>


      </div>
    );
  }
}