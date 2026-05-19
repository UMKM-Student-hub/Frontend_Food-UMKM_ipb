import { Component } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { MenuItem } from "../../domain/MenuItem";
import { ProductCategory } from "../../domain/enums";

interface ProductFormModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialData: MenuItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  // Perhatikan: Payload sekarang adalah FormData, bukan MenuItemCreateRequest
  onSave: (payload: FormData, id?: number) => void;
}

interface ProductFormModalState {
  name: string;
  price: string;
  stock: string;
  category: string;
  description: string;
  photo_file: File | null; // Untuk menyimpan file fisik
  preview_url: string; // Untuk preview gambar di UI
}

const INITIAL_STATE: ProductFormModalState = {
  name: "",
  price: "",
  stock: "",
  category: "",
  description: "",
  photo_file: null,
  preview_url: "",
};

export class ProductFormModal extends Component<
  ProductFormModalProps,
  ProductFormModalState
> {
  constructor(props: ProductFormModalProps) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidUpdate(prevProps: ProductFormModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      if (this.props.mode === "edit" && this.props.initialData) {
        const { name, price, stock, category, description, photo_url } =
          this.props.initialData;
        this.setState({
          name,
          price: price.toString(),
          stock: stock.toString(),
          category,
          description: description || "",
          photo_file: null,
          preview_url: photo_url || "", // Tampilkan gambar lama jika ada
        });
      } else {
        this.setState({ ...INITIAL_STATE });
      }
    }
  }

  // Handler untuk Input Teks & Select biasa
  private handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Pick<
      ProductFormModalState,
      keyof ProductFormModalState
    >);
  };

  // Handler KHUSUS untuk Input File (Gambar)
  private handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Buat URL sementara untuk preview di dalam browser
      const preview_url = URL.createObjectURL(file);
      this.setState({ photo_file: file, preview_url });
    }
  };

  private handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    const { name, price, stock, category, description, photo_file } =
      this.state;
    const { mode, initialData, onSave } = this.props;

    if (!name || !price || !stock || !category) {
      alert("Harap lengkapi semua field yang wajib!");
      return;
    }

    // --- BUNGKUS DATA KE DALAM FORMDATA ---
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);

    if (description) formData.append("description", description);

    // Jika ada file foto yang dipilih, masukkan ke form
    if (photo_file) {
      formData.append("photo", photo_file);
    }

    if (mode === "edit" && initialData) {
      onSave(formData, initialData.id);
    } else {
      onSave(formData);
    }
  };

  render() {
    const { isOpen, onClose, isSubmitting } = this.props;
    const { name, price, stock, category, description, preview_url } =
      this.state;

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
        <div className="bg-[#FFD13B] w-full max-w-4xl rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-8 text-[#1B2B65] text-4xl font-light hover:text-white transition-colors z-10"
            aria-label="Tutup"
          >
            &times;
          </button>

          <form
            onSubmit={this.handleSubmit}
            className="overflow-y-auto px-10 py-10"
          >
            {/* --- Bagian Atas: Upload Foto dengan Preview --- */}
            <div className="flex flex-col items-center mb-10">
              <label
                htmlFor="photo_upload"
                className="cursor-pointer w-28 h-28 bg-white rounded-full flex justify-center items-center shadow-sm mb-4 hover:scale-105 transition-transform overflow-hidden relative border-4 border-white group"
                title="Klik untuk memilih foto"
              >
                {preview_url ? (
                  // Tampilkan Preview Foto
                  <>
                    <img
                      src={preview_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold">Ubah</span>
                    </div>
                  </>
                ) : (
                  // Tampilkan Ikon Kamera Jika Kosong
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </label>

              <h2 className="text-[#1B2B65] font-bold text-lg mb-1">
                Upload Photo Menu
              </h2>

              {/* Input file yang disembunyikan */}
              <input
                id="photo_upload"
                type="file"
                accept="image/*" // Hanya menerima file gambar
                onChange={this.handleFileChange}
                className="hidden"
              />
            </div>

            {/* --- Bagian Bawah: Grid Form 2 Kolom --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[#1B2B65] font-bold">
              {/* Kolom Kiri */}
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block mb-2 text-lg">Nama Menu</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal"
                    placeholder="Contoh: Ayam Geprek"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category_select"
                    className="block mb-2 text-lg"
                  >
                    Jenis Makanan
                  </label>
                  <div className="relative">
                    <select
                      id="category_select"
                      required
                      name="category"
                      value={category}
                      onChange={this.handleInputChange}
                      className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Pilih Jenis
                      </option>
                      {Object.values(ProductCategory).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.replace("_", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-[#1B2B65]">
                      <svg
                        className="w-5 h-5 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-lg">
                    Ketersediaan Stok
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    name="stock"
                    value={stock}
                    onChange={this.handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal"
                    placeholder="Contoh: 15"
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block mb-2 text-lg">Harga (Rp)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    name="price"
                    value={price}
                    onChange={this.handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal"
                    placeholder="Contoh: 15000"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="block mb-2 text-lg">Deskripsi Menu</label>
                  <textarea
                    required
                    name="description"
                    value={description}
                    onChange={this.handleInputChange}
                    className="w-full flex-1 px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal resize-none min-h-35"
                    placeholder="Deskripsikan produk anda..."
                  />
                </div>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2D3F76] text-white px-16 py-3 rounded-xl font-bold text-xl tracking-wide hover:bg-[#1B2B65] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? "Menyimpan..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
