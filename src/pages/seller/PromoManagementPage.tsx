import { Component } from "react";

// Import Services
import { PromoService } from "../../services/PromoService";
import { CatalogService } from "../../services/CatalogService";

// Import Domain Types
import type { Promotion, CreatePromoRequest } from "../../domain/Promotion";
import type { MenuItem } from "../../domain/MenuItem";

// Import UI Components
import { PageHeader } from "../../components/seller/PageHeader";
import { PromoTableRow } from "../../components/seller/PromoTableRow";
import { PromoFormModal } from "../../components/seller/PromoFormModal";

// Interface Props Kosong untuk Linter
interface PromoManagementPageProps {}

interface PromoManagementPageState {
  promos: Promotion[];
  myProducts: MenuItem[]; // Dibutuhkan untuk dropdown form modal
  isLoading: boolean;
  error: string | null;

  // State untuk kontrol Modal
  isModalOpen: boolean;
  isSubmitting: boolean;
}

export default class PromoManagementPage extends Component<
  PromoManagementPageProps,
  PromoManagementPageState
> {
  private promoService: PromoService;
  private catalogService: CatalogService;

  constructor(props: PromoManagementPageProps) {
    super(props);
    this.state = {
      promos: [],
      myProducts: [],
      isLoading: true,
      error: null,
      isModalOpen: false,
      isSubmitting: false,
    };

    // Inisialisasi Service
    this.promoService = new PromoService();
    this.catalogService = new CatalogService();
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  // --- API CALLS ---

  // Mengambil daftar promo dan daftar produk secara paralel
  private fetchInitialData = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });
    try {
      // Promise.all mempercepat proses loading karena 2 request berjalan bersamaan
      const [promosData, productsData] = await Promise.all([
        this.promoService.getMyPromos(),
        this.catalogService.getMyProducts(),
      ]);

      this.setState({
        promos: promosData,
        myProducts: productsData,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat data halaman promo.";
      this.setState({ error: errorMessage });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleCreatePromo = async (
    payload: CreatePromoRequest,
  ): Promise<void> => {
    this.setState({ isSubmitting: true });

    try {
      const newPromo = await this.promoService.createPromo(payload);

      // Update state secara lokal tanpa perlu refresh halaman / hit API ulang
      this.setState((prevState) => ({
        promos: [newPromo, ...prevState.promos], // Promo baru taruh di atas
        isModalOpen: false,
      }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal membuat promo baru.";
      alert(`Gagal menyimpan data: ${errorMessage}`);
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  private handleDeactivatePromo = async (id: number): Promise<void> => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menonaktifkan promo ini secara paksa?",
      )
    ) {
      return;
    }

    try {
      // Panggil API untuk menonaktifkan
      const updatedPromo = await this.promoService.deactivatePromo(id);

      // Update data promo spesifik di state
      this.setState((prevState) => ({
        promos: prevState.promos.map((p) => (p.id === id ? updatedPromo : p)),
      }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menonaktifkan promo.";
      alert(`Terjadi kesalahan: ${errorMessage}`);
    }
  };

  // --- MODAL HANDLERS ---

  private openModal = (): void => {
    if (this.state.myProducts.length === 0) {
      alert(
        "Anda belum memiliki produk. Silakan tambah produk terlebih dahulu di menu 'Menu'.",
      );
      return;
    }
    this.setState({ isModalOpen: true });
  };

  private closeModal = (): void => {
    this.setState({ isModalOpen: false });
  };

  // --- RENDER ---
  render() {
    const { promos, myProducts, isLoading, error, isModalOpen, isSubmitting } =
      this.state;

    return (
      <div className="w-full relative pb-20">
        {/* 1. Komponen Pop-up Modal Promo */}
        <PromoFormModal
          isOpen={isModalOpen}
          myProducts={myProducts}
          isSubmitting={isSubmitting}
          onClose={this.closeModal}
          onSave={this.handleCreatePromo}
        />

        {/* 2. Komponen Header */}
        <PageHeader
          title="Menu Promo"
          buttonLabel="Tambah Promo"
          onButtonClick={this.openModal}
        />

        {/* Handling State: Loading & Error */}
        {isLoading && (
          <div className="flex justify-center py-20 text-[#1B2B65] font-medium">
            Memuat data promo...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 shadow-sm">
            {error}{" "}
            <button
              onClick={this.fetchInitialData}
              className="underline ml-2 font-semibold hover:text-red-800"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* 3. Komponen Tabel Promo */}
        {!isLoading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-[#FFD13B] text-[#1B2B65]">
                    <th className="py-5 px-6 font-bold w-24">Foto</th>
                    <th className="py-5 px-6 font-bold">Detail Promo</th>
                    <th className="py-5 px-6 font-bold">Info Diskon</th>
                    <th className="py-5 px-6 font-bold">Masa Berlaku</th>
                    <th className="py-5 px-6 font-bold text-center w-32">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {promos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-16 text-center text-gray-500 text-lg"
                      >
                        Belum ada promo yang berjalan. Klik "Tambah Promo" untuk
                        menarik lebih banyak pembeli!
                      </td>
                    </tr>
                  ) : (
                    promos.map((promo) => (
                      <PromoTableRow
                        key={promo.id}
                        promo={promo}
                        onDeactivate={this.handleDeactivatePromo}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
}
