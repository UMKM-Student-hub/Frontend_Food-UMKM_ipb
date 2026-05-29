import { Component, createRef } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { UMKM } from "../../domain/UMKM";
import type { MenuItem } from "../../domain/MenuItem";
import { CatalogService } from "../../services/CatalogService";
import { ReviewService } from "../../services/ReviewService";

interface UMKMCardProps {
  umkm: UMKM;
  activeFilter: string;
  searchKeyword: string;
}

interface UMKMCardState {
  menus: MenuItem[];
  isLoading: boolean;
  averageRating: number;
  reviewCount: number;
}

export class UMKMCatalogCard extends Component<UMKMCardProps, UMKMCardState> {
  private catalogService = new CatalogService();
  private reviewService = new ReviewService();
  private scrollRef = createRef<HTMLDivElement>();

  state: UMKMCardState = {
    menus: [],
    isLoading: true,
    averageRating: 0,
    reviewCount: 0,
  };

  async componentDidMount() {
    try {
      const [menus, reviews] = await Promise.all([
        this.catalogService.getUMKMMenu(this.props.umkm.id).catch(() => []),
        this.reviewService
          .getUMKMPublicReviews(this.props.umkm.id)
          .catch(() => []),
      ]);

      const reviewCount = reviews.length;
      const averageRating =
        reviewCount > 0
          ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewCount
          : 0;

      this.setState({ menus, averageRating, reviewCount, isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  private scrollRight = (e: MouseEvent): void => {
    e.preventDefault();
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  private getFullImageUrl(path: string | undefined): string {
    const fallback = "/images/default-food.png";
    if (!path) return fallback;
    return path.startsWith("/") ? `http://localhost:8000${path}` : path;
  }

  render() {
    const { umkm, activeFilter, searchKeyword } = this.props;
    const { menus, isLoading, averageRating, reviewCount } = this.state;

    const kw = searchKeyword.toLowerCase().trim();
    const isUmkmMatch = umkm.name.toLowerCase().includes(kw);

    const filteredMenus = menus.filter((m) => {
      const category = m.category || (m as any).category_name || "";
      const isCategoryMatch =
        activeFilter === "Semua" ||
        category.toLowerCase() === activeFilter.toLowerCase();
      const isMenuMatch = m.name.toLowerCase().includes(kw);

      if (kw === "") return isCategoryMatch;
      return isCategoryMatch && (isUmkmMatch || isMenuMatch);
    });

    if (!isLoading && filteredMenus.length === 0 && !isUmkmMatch) {
      return null;
    }

    return (
      <Link
        to={`/catalog/${umkm.id}`}
        className="block bg-white border border-gray-100 hover:border-[#FFCF00] rounded-3xl p-5 md:p-6 mb-6 shadow-sm w-full cursor-pointer hover:shadow-xl transition-all duration-300 relative group"
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-[#1B2B65] font-extrabold text-2xl mb-1 group-hover:text-[#FFB20E] transition-colors">
              {umkm.name}
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-base">
              {umkm.location}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100 min-w-18">
            <div className="text-[#1B2B65] font-black text-lg flex items-center gap-1 justify-center">
              <svg
                className="w-4 h-4 text-[#FFB20E]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {reviewCount > 0
                ? averageRating.toLocaleString("id-ID", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })
                : "Baru"}
            </div>
            <div className="text-gray-500 text-[10px] font-extrabold uppercase tracking-wider mt-0.5 text-center">
              {reviewCount > 0 ? `${reviewCount} Ulasan` : "Belum ada"}
            </div>
          </div>
        </div>

        <div className="relative mt-2">
          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-gray-400 font-medium">
              Memuat menu kantin...
            </div>
          ) : filteredMenus.length === 0 ? (
            <div className="h-28 md:h-32 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
              <svg
                className="w-8 h-8 text-gray-300 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-gray-400 font-medium text-sm md:text-base text-center px-4">
                {kw !== ""
                  ? "Menu tidak ditemukan dari pencarian ini."
                  : `Kategori ${activeFilter} sedang kosong di kantin ini.`}
              </p>
            </div>
          ) : (
            <div
              ref={this.scrollRef}
              className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth hide-scrollbar pb-4"
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {filteredMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="shrink-0 w-36 md:w-44 flex flex-col hover:opacity-90 transition-opacity"
                >
                  <img
                    src={this.getFullImageUrl(
                      menu.photo_url || (menu as any).photoUrl,
                    )}
                    alt={menu.name}
                    className="w-full h-28 md:h-32 object-cover rounded-2xl mb-3 shadow-sm border border-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/default-food.png";
                    }}
                  />
                  <h3 className="text-[#1B2B65] font-bold text-sm md:text-base mb-1.5 truncate">
                    {menu.name}
                  </h3>
                  <div className="bg-[#FDECE2] text-[#C05020] text-xs md:text-sm font-bold px-2.5 py-1 rounded-lg w-fit">
                    Rp {menu.price.toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredMenus.length > 3 && (
            <button
              onClick={this.scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white text-[#1B2B65] border border-gray-100 w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFB20E] hover:text-white hover:border-transparent transition-all z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </Link>
    );
  }
}

interface CatalogDashboardProps {
  searchKeyword?: string;
}

interface CatalogDashboardState {
  umkms: UMKM[];
  activeFilter: string;
  isLoading: boolean;
  visibleCount: number;
}

export class CatalogDashboard extends Component<
  CatalogDashboardProps,
  CatalogDashboardState
> {
  private catalogService = new CatalogService();

  state: CatalogDashboardState = {
    umkms: [],
    activeFilter: "Semua",
    isLoading: true,
    visibleCount: 3,
  };

  async componentDidMount() {
    try {
      const umkms = await this.catalogService.listAllUMKM();
      this.setState({ umkms, isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  private setFilter = (filter: string): void => {
    this.setState({ activeFilter: filter, visibleCount: 3 });
  };

  private loadMore = (): void => {
    this.setState((prev) => ({ visibleCount: prev.visibleCount + 3 }));
  };

  render() {
    const { umkms, activeFilter, isLoading, visibleCount } = this.state;
    const { searchKeyword = "" } = this.props;
    const filters = ["Semua", "Makanan", "Minuman", "Jajanan"];
    const isSearching = searchKeyword.trim() !== "";
    const activeUmkms = isSearching ? umkms : umkms.slice(0, visibleCount);

    return (
      <section className="bg-[#FFFCF5] min-h-screen w-full py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B2B65] mb-8 tracking-tight">
            Jajan dari Kantin Favoritmu Hari Ini!
          </h1>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => this.setFilter(f)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm md:text-base border-2 transition-all shadow-sm ${
                  activeFilter === f
                    ? "bg-[#FFB20E] border-[#FFB20E] text-[#1B2B65]"
                    : "bg-white border-gray-200 text-gray-500 hover:border-[#FFB20E] hover:text-[#1B2B65]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FFB20E] border-t-transparent"></div>
            </div>
          ) : (
            <div className="catalog-wrapper flex flex-col gap-2">
              {activeUmkms.map((umkm) => (
                <UMKMCatalogCard
                  key={umkm.id}
                  umkm={umkm}
                  activeFilter={activeFilter}
                  searchKeyword={searchKeyword}
                />
              ))}

              {!isLoading && (
                <div className="empty-search-state hidden flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                    <svg
                      className="w-10 h-10 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[#1B2B65] font-extrabold text-xl md:text-2xl mb-2">
                    Oops, Pencarian Tidak Ditemukan
                  </h3>
                  <p className="text-gray-500 font-medium text-center">
                    Coba gunakan kata kunci lain atau periksa ejaanmu kembali.
                  </p>
                </div>
              )}
            </div>
          )}

          {!isLoading && visibleCount < umkms.length && !isSearching && (
            <div className="flex justify-center mt-10">
              <button
                onClick={this.loadMore}
                className="bg-white border-2 border-[#1B2B65] text-[#1B2B65] font-bold px-10 py-3.5 rounded-full hover:bg-[#1B2B65] hover:text-white transition-colors shadow-sm"
              >
                Lihat Lebih Banyak Kantin
              </button>
            </div>
          )}
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .catalog-wrapper:has(a) .empty-search-state { display: none !important; }
          .catalog-wrapper:not(:has(a)) .empty-search-state { display: flex !important; }
        `,
          }}
        />
      </section>
    );
  }
}
