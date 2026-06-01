import { Component } from "react";
import { HeroHome } from "../../components/buyer/HeroHome";
import { SearchBar } from "../../components/buyer/SearchBar";
import { PromoCard } from "../../components/buyer/PromoCard";
import { CatalogDashboard } from "../../components/buyer/CatalogDashboard";
import { FeatureBanner } from "../../components/buyer/FeatureBanner";
import type { Promotion } from "../../domain/Promotion";
import { PromoService } from "../../services/PromoService";

interface CatalogPageState {
  searchKeyword: string;
  promos: Promotion[];
  isLoadingPromos: boolean;
  error: string | null;
}

export default class CatalogPage extends Component<{}, CatalogPageState> {
  private promoService = new PromoService();

  state: CatalogPageState = {
    searchKeyword: "",
    promos: [],
    isLoadingPromos: true,
    error: null,
  };

  async componentDidMount() {
    await this.fetchActivePromos();
  }

  private fetchActivePromos = async (): Promise<void> => {
    this.setState({ isLoadingPromos: true, error: null });
    try {
      const data = await this.promoService.listActivePromos();
      this.setState({ promos: data });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat promo";
      this.setState({ error: msg });
    } finally {
      this.setState({ isLoadingPromos: false });
    }
  };

  private handleSearchChange = (keyword: string): void => {
    this.setState({ searchKeyword: keyword });
  };

  private formatExpiry(endDate: string): string {
    const diff = Math.ceil(
      (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return diff <= 0 ? "Berakhir hari ini" : `${diff} Hari Lagi`;
  }

  render() {
    const { searchKeyword, promos, isLoadingPromos, error } = this.state;
    const isSearching = searchKeyword.trim().length > 0;

    return (
      <div className="min-h-screen bg-[#FFFCF5] flex flex-col font-sans">
        <div className="relative z-10">
          <HeroHome />
        </div>

        <main className="grow w-full relative">
          <div className="relative z-20 w-full -mt-7 md:-mt-8">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
              <div className="w-full md:w-3/5 lg:w-1/2">
                <SearchBar
                  value={searchKeyword}
                  onChange={this.handleSearchChange}
                />
              </div>
            </div>
          </div>

          {!isSearching && (
            <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 md:pt-14 pb-6 animate-fadeIn">
              {isLoadingPromos ? (
                <div className="text-center py-10 text-gray-500 font-semibold animate-pulse">
                  Memuat promo menarik...
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6 border border-red-100 font-medium">
                  {error}
                </div>
              ) : promos.length === 0 ? (
                <div className="text-center py-10 text-gray-400 font-medium">
                  Belum ada promo aktif saat ini.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
          )}

          <div className={isSearching ? "pt-10 md:pt-14" : ""}>
            <CatalogDashboard searchKeyword={searchKeyword} />
          </div>

          <div className="pb-16 pt-8 bg-linear-to-b from-[#FFFCF5] to-[#FFF3D0]">
            <FeatureBanner />
          </div>
        </main>
      </div>
    );
  }
}
