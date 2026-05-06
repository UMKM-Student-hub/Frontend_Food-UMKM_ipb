import { Component } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { MenuItem } from "../../domain/MenuItem";
import type { CreatePromoRequest } from "../../domain/Promotion";
import { DiscountType } from "../../domain/enums";

interface PromoFormModalProps {
  isOpen: boolean;
  myProducts: MenuItem[]; // Daftar produk untuk dropdown
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (payload: CreatePromoRequest) => void;
}

interface PromoFormModalState {
  menu_item_id: string;
  name: string;
  photo_url: string;
  discount_type: DiscountType | "";
  discount_value: string;
  start_date: string;
  end_date: string;
  errorMessage: string | null;
}

const INITIAL_STATE: PromoFormModalState = {
  menu_item_id: "",
  name: "",
  photo_url: "",
  discount_type: "",
  discount_value: "",
  start_date: "",
  end_date: "",
  errorMessage: null,
};

export class PromoFormModal extends Component<
  PromoFormModalProps,
  PromoFormModalState
> {
  constructor(props: PromoFormModalProps) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  // Reset form setiap kali modal dibuka kembali
  componentDidUpdate(prevProps: PromoFormModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({ ...INITIAL_STATE });
    }
  }

  private handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    this.setState({ [name]: value, errorMessage: null } as Pick<
      PromoFormModalState,
      keyof PromoFormModalState
    >);
  };

  private handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    const {
      menu_item_id,
      name,
      photo_url,
      discount_type,
      discount_value,
      start_date,
      end_date,
    } = this.state;
    const { onSave } = this.props;

    // --- VALIDASI FRONTEND ---
    if (
      !menu_item_id ||
      !name ||
      !discount_type ||
      !discount_value ||
      !start_date ||
      !end_date
    ) {
      this.setState({
        errorMessage: "Harap lengkapi semua field yang diwajibkan!",
      });
      return;
    }

    const valueNum = Number(discount_value);
    if (isNaN(valueNum) || valueNum <= 0) {
      this.setState({ errorMessage: "Nilai diskon harus lebih dari 0." });
      return;
    }

    if (discount_type === DiscountType.PERCENTAGE && valueNum >= 100) {
      this.setState({
        errorMessage: "Diskon persentase tidak boleh 100% atau lebih.",
      });
      return;
    }

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset jam agar validasi hari ini akurat

    if (endDateObj < today) {
      this.setState({
        errorMessage: "Tanggal berakhir tidak boleh di masa lalu.",
      });
      return;
    }

    if (startDateObj > endDateObj) {
      this.setState({
        errorMessage: "Tanggal mulai tidak boleh melebihi tanggal berakhir.",
      });
      return;
    }

    // --- SUBMIT PAYLOAD ---
    const payload: CreatePromoRequest = {
      menu_item_id: Number(menu_item_id),
      name,
      photo_url: photo_url || undefined,
      discount_type: discount_type as DiscountType,
      discount_value: valueNum,
      start_date,
      end_date,
    };

    onSave(payload);
  };

  render() {
    const { isOpen, onClose, isSubmitting, myProducts } = this.props;
    const {
      menu_item_id,
      name,
      photo_url,
      discount_type,
      discount_value,
      start_date,
      end_date,
      errorMessage,
    } = this.state;

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
        {/* Container Modal (Kuning UniBites) */}
        <div className="bg-[#FFD13B] w-full max-w-4xl rounded-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
          <button
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
            {/* --- Bagian Atas: Upload Foto Promo --- */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-white rounded-full flex justify-center items-center shadow-sm mb-4">
                <svg
                  className="w-10 h-10 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-[#1B2B65] font-bold text-lg mb-2">
                Upload Banner Promo
              </h2>
              <input
                type="text"
                name="photo_url"
                value={photo_url}
                onChange={this.handleInputChange}
                placeholder="https://link-gambar.com/banner.jpg (opsional)"
                className="w-72 px-4 py-2 bg-white/80 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1B2B65] text-center"
              />
            </div>

            {/* --- Pesan Error Validasi --- */}
            {errorMessage && (
              <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md font-medium">
                {errorMessage}
              </div>
            )}

            {/* --- Bagian Bawah: Grid Form 2 Kolom --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[#1B2B65] font-bold">
              {/* Kolom Kiri */}
              <div className="flex flex-col gap-6">
                <div>
                  <label htmlFor="promo_name" className="block mb-2 text-lg">
                    Judul Promo
                  </label>
                  <input
                    id="promo_name"
                    required
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal"
                    placeholder="Contoh: Flash Sale Akhir Bulan!"
                  />
                </div>
                <div>
                  <label htmlFor="promo_product" className="block mb-2 text-lg">
                    Produk yang Didiskon
                  </label>
                  <select
                    id="promo_product"
                    required
                    name="menu_item_id"
                    value={menu_item_id}
                    onChange={this.handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal"
                  >
                    <option value="" disabled>
                      Pilih Produk
                    </option>
                    {myProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stok: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="start_date" className="block mb-2 text-lg">
                    Tanggal Mulai
                  </label>
                  <input
                    id="start_date"
                    required
                    type="date"
                    name="start_date"
                    value={start_date}
                    onChange={this.handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal"
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="flex flex-col gap-6">
                <div>
                  <label htmlFor="discount_type" className="block mb-2 text-lg">
                    Tipe Diskon
                  </label>
                  <select
                    id="discount_type"
                    required
                    name="discount_type"
                    value={discount_type}
                    onChange={this.handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal"
                  >
                    <option value="" disabled>
                      Pilih Tipe Diskon
                    </option>
                    <option value={DiscountType.PERCENTAGE}>
                      Persentase (%)
                    </option>
                    <option value={DiscountType.NOMINAL}>
                      Potongan Harga (Rp)
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="discount_value"
                    className="block mb-2 text-lg"
                  >
                    Nilai Diskon{" "}
                    {discount_type === DiscountType.PERCENTAGE ? "(%)" : "(Rp)"}
                  </label>
                  <input
                    id="discount_value"
                    required
                    type="number"
                    min="1"
                    name="discount_value"
                    value={discount_value}
                    onChange={this.handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal"
                    placeholder={
                      discount_type === DiscountType.PERCENTAGE
                        ? "Contoh: 20"
                        : "Contoh: 5000"
                    }
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block mb-2 text-lg">
                    Tanggal Berakhir
                  </label>
                  <input
                    id="end_date"
                    required
                    type="date"
                    name="end_date"
                    value={end_date}
                    onChange={this.handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal"
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
                {isSubmitting ? "Memproses..." : "Save Promo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
