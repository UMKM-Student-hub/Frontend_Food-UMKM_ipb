import { Component } from "react";
import { CatalogService } from "../../services/CatalogService";
import type { MenuItem, MenuItemCreateRequest } from "../../domain/MenuItem";
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

  // 2. Terapkan interface props pada constructor
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

  // --- API CALLS ---
  private fetchProducts = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });
    try {
      const data = await this.catalogService.getMyProducts();
      this.setState({ products: data });
    } catch (err: unknown) {
      // 3. Perbaiki error handling (hilangkan 'any')
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan yang tidak diketahui";
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
      // 3. Perbaiki error handling (hilangkan 'any')
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menghapus produk";
      alert(`Gagal menghapus: ${errorMessage}`);
    }
  };

  private handleSaveForm = async (
    payload: MenuItemCreateRequest,
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
      // 3. Perbaiki error handling (hilangkan 'any')
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menyimpan data";
      alert(`Gagal menyimpan data: ${errorMessage}`);
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  // --- MODAL HANDLERS ---
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

  // --- RENDER ---
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
      <div className="w-full relative pb-20">
        {/* 1. Komponen Modal */}
        <ProductFormModal
          isOpen={isModalOpen}
          mode={modalMode}
          initialData={selectedProduct}
          isSubmitting={isSubmitting}
          onClose={this.closeModal}
          onSave={this.handleSaveForm}
        />

        {/* 2. Komponen Header */}
        {/* Pada desain Figma, tombol aksi tertulis "Nama Produk", ini disesuaikan dengan desain */}
        <PageHeader
          title="Menu"
          buttonLabel="Nama Produk"
          onButtonClick={this.openAddModal}
        />

        {/* Handling State: Loading & Error */}
        {isLoading && (
          <div className="flex justify-center py-20 text-gray-500 font-medium">
            Memuat data produk...
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            {error}{" "}
            <button onClick={this.fetchProducts} className="underline ml-2">
              Coba Lagi
            </button>
          </div>
        )}

        {/* 3. Komponen Tabel (Render hanya jika data siap) */}
        {!isLoading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-[#FFD13B] text-[#1B2B65]">
                    <th className="py-5 px-6 font-bold w-24">Foto</th>
                    <th className="py-5 px-6 font-bold">Nama Produk</th>
                    <th className="py-5 px-6 font-bold">Jenis Makanan</th>
                    <th className="py-5 px-6 font-bold">Harga</th>
                    <th className="py-5 px-6 font-bold">Stok</th>
                    <th className="py-5 px-6 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-500 text-lg"
                      >
                        Belum ada produk. Klik "Nama Produk" untuk mulai
                        berjualan.
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
