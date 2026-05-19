import { Component } from "react";
import { PromoService } from "../../services/PromoService";
import { CatalogService } from "../../services/CatalogService";
import type { Promotion } from "../../domain/Promotion";
import type { MenuItem } from "../../domain/MenuItem";
import { PageHeader } from "../../components/seller/PageHeader";
import { PromoTableRow } from "../../components/seller/PromoTableRow";
import { PromoFormModal } from "../../components/seller/PromoFormModal";

interface PromoManagementPageProps {}

interface PromoManagementPageState {
  promos: Promotion[];
  myProducts: MenuItem[];
  isLoading: boolean;
  error: string | null;
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
    this.promoService = new PromoService();
    this.catalogService = new CatalogService();
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  private fetchInitialData = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });
    try {
      const [promosData, productsData] = await Promise.all([
        this.promoService.getMyPromos(),
        this.catalogService.getMyProducts(),
      ]);

      this.setState({
        promos: promosData,
        myProducts: productsData,
      });
    } catch (err: unknown) {
      let errorMessage = "Gagal memuat data promosi";
      if (err instanceof Error) {
        errorMessage = err.message.includes("[object Object]")
          ? "Gagal memproses data dari server. Pastikan backend berjalan."
          : err.message;
      }
      this.setState({ error: errorMessage });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleSavePromo = async (payload: FormData): Promise<void> => {
    this.setState({ isSubmitting: true });
    try {
      const newPromo = await this.promoService.createPromo(payload);
      this.setState((prevState) => ({
        promos: [...prevState.promos, newPromo],
        isModalOpen: false,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan promo";
      alert(`Error: ${msg}`);
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  private handleDeactivatePromo = async (id: number): Promise<void> => {
    if (!window.confirm("Apakah Anda yakin ingin menonaktifkan promo ini?"))
      return;
    try {
      await this.promoService.deactivatePromo(id);
      this.setState((prevState) => ({
        promos: prevState.promos.filter((p) => p.id !== id),
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses";
      alert(`Gagal: ${msg}`);
    }
  };

  private openModal = () => this.setState({ isModalOpen: true });
  private closeModal = () => this.setState({ isModalOpen: false });

  render() {
    const { promos, myProducts, isLoading, error, isModalOpen, isSubmitting } =
      this.state;

    return (
      <div className="w-full relative pb-20 px-4 md:px-0">
        <PromoFormModal
          isOpen={isModalOpen}
          myProducts={myProducts}
          isSubmitting={isSubmitting}
          onClose={this.closeModal}
          onSave={this.handleSavePromo}
        />

        <PageHeader
          title="Promosi & Diskon"
          buttonLabel="Tambah Promo"
          onButtonClick={this.openModal}
        />

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-[#FFD13B] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#1B2B65] font-bold animate-pulse">
              Menyiapkan daftar promo...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-medium text-center md:text-left">
              {error}
            </span>
            <button
              onClick={this.fetchInitialData}
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="bg-transparent md:bg-white md:rounded-3xl md:shadow-sm md:border md:border-gray-100 overflow-hidden mt-6 md:mt-0">
            <div className="w-full">
              <table className="w-full text-left border-collapse block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-[#FFD13B] text-[#1B2B65]">
                    <th className="py-6 px-6 font-bold uppercase text-xs tracking-widest w-28 block md:table-cell">
                      Banner
                    </th>
                    <th className="py-6 px-6 font-bold uppercase text-xs tracking-widest block md:table-cell">
                      Detail Promo
                    </th>
                    <th className="py-6 px-6 font-bold uppercase text-xs tracking-widest block md:table-cell">
                      Diskon
                    </th>
                    <th className="py-6 px-6 font-bold uppercase text-xs tracking-widest block md:table-cell">
                      Periode
                    </th>
                    <th className="py-6 px-6 font-bold uppercase text-xs tracking-widest text-center block md:table-cell">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group md:divide-y md:divide-gray-100">
                  {promos.length === 0 ? (
                    <tr className="block md:table-row bg-white rounded-2xl shadow-sm md:shadow-none p-8 text-center">
                      <td
                        colSpan={5}
                        className="block md:table-cell py-12 md:py-24 text-center"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-5xl mb-4">📢</span>
                          <p className="text-gray-500 text-lg font-medium">
                            Belum ada promo yang aktif.
                          </p>
                          <p className="text-gray-400 text-sm">
                            Buat promo pertamamu untuk menarik pelanggan!
                          </p>
                        </div>
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
