import { Component } from "react";
import { CatalogService } from "../../services/CatalogService";
import type { MenuItem } from "../../domain/MenuItem";
import { PageHeader } from "../../components/seller/PageHeader";
import { ProductTableRow } from "../../components/seller/ProductTableRow";
import { ProductFormModal } from "../../components/seller/ProductFormModal";

interface ProductManagementPageProps {}

interface ProductManagementState {
  products: MenuItem[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  modalMode: "add" | "edit";
  selectedProduct: MenuItem | null;
  isSubmitting: boolean;
}

export default class ProductManagementPage extends Component<
  ProductManagementPageProps,
  ProductManagementState
> {
  private catalogService: CatalogService;

  constructor(props: ProductManagementPageProps) {
    super(props);
    this.state = {
      products: [],
      isLoading: true,
      error: null,
      isModalOpen: false,
      modalMode: "add",
      selectedProduct: null,
      isSubmitting: false,
    };
    this.catalogService = new CatalogService();
  }

  componentDidMount() {
    this.fetchProducts();
  }

  private fetchProducts = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });
    try {
      const data = await this.catalogService.getMyProducts();
      this.setState({ products: data });
    } catch (err: unknown) {
      let errorMessage = "Terjadi kesalahan yang tidak diketahui";
      if (err instanceof Error) {
        errorMessage = err.message.includes("[object Object]")
          ? "Format data API tidak valid. Silakan cek koneksi backend."
          : err.message;
      }
      this.setState({ error: errorMessage });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?"))
      return;
    try {
      await this.catalogService.deleteProduct(id);
      this.setState((prevState) => ({
        products: prevState.products.filter((p) => p.id !== id),
      }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menghapus produk";
      alert(`Gagal menghapus: ${errorMessage}`);
    }
  };

  private handleSaveForm = async (
    payload: FormData,
    id?: number,
  ): Promise<void> => {
    this.setState({ isSubmitting: true });
    try {
      if (this.state.modalMode === "add") {
        const newProduct = await this.catalogService.addProduct(payload);
        this.setState((prevState) => ({
          products: [...prevState.products, newProduct],
          isModalOpen: false,
        }));
      } else if (this.state.modalMode === "edit" && id) {
        const updatedProduct = await this.catalogService.updateProduct(
          id,
          payload,
        );
        this.setState((prevState) => ({
          products: prevState.products.map((p) =>
            p.id === id ? updatedProduct : p,
          ),
          isModalOpen: false,
        }));
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menyimpan data";
      alert(`Gagal menyimpan data: ${errorMessage}`);
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  private openAddModal = (): void => {
    this.setState({
      isModalOpen: true,
      modalMode: "add",
      selectedProduct: null,
    });
  };

  private openEditModal = (product: MenuItem): void => {
    this.setState({
      isModalOpen: true,
      modalMode: "edit",
      selectedProduct: product,
    });
  };

  private closeModal = (): void => {
    this.setState({ isModalOpen: false, selectedProduct: null });
  };

  render() {
    const {
      products,
      isLoading,
      error,
      isModalOpen,
      modalMode,
      selectedProduct,
      isSubmitting,
    } = this.state;

    return (
      <div className="w-full relative pb-20 px-4 md:px-0">
        <ProductFormModal
          isOpen={isModalOpen}
          mode={modalMode}
          initialData={selectedProduct}
          isSubmitting={isSubmitting}
          onClose={this.closeModal}
          onSave={this.handleSaveForm}
        />

        <PageHeader
          title="Menu"
          buttonLabel="Tambah Produk"
          onButtonClick={this.openAddModal}
        />

        {isLoading && (
          <div className="flex justify-center py-20 text-[#1B2B65] font-medium">
            Memuat data produk...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200 shadow-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={this.fetchProducts}
              className="underline font-semibold hover:text-red-800"
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
                    <th className="py-6 px-6 font-bold w-24 uppercase text-xs tracking-widest">
                      Foto
                    </th>
                    <th className="py-6 px-6 font-bold uppercase text-xs tracking-widest">
                      Nama Produk
                    </th>
                    <th className="py-6 px-6 font-bold uppercase text-xs tracking-widest">
                      Jenis Makanan
                    </th>
                    <th className="py-6 px-6 font-bold uppercase text-xs tracking-widest">
                      Harga
                    </th>
                    <th className="py-6 px-6 font-bold uppercase text-xs tracking-widest">
                      Stok
                    </th>
                    <th className="py-6 px-6 font-bold uppercase text-xs tracking-widest text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group md:divide-y md:divide-gray-100">
                  {products.length === 0 ? (
                    <tr className="block md:table-row bg-white rounded-2xl shadow-sm md:shadow-none p-8 text-center">
                      <td
                        colSpan={6}
                        className="block md:table-cell py-12 md:py-24 text-center"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-5xl mb-4">🍽️</span>
                          <p className="text-gray-500 text-lg font-medium">
                            Belum ada produk.
                          </p>
                          <p className="text-gray-400 text-sm">
                            Klik tombol untuk mulai berjualan!
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <ProductTableRow
                        key={product.id}
                        product={product}
                        onEdit={this.openEditModal}
                        onDelete={this.handleDelete}
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
