import { Component } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { MenuItem } from "../../domain/MenuItem";
import { DiscountType } from "../../domain/enums";

interface PromoFormModalProps {
  isOpen: boolean;
  myProducts: MenuItem[];
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (payload: FormData) => void;
}

interface PromoFormModalState {
  menu_item_id: string;
  name: string;
  photo_file: File | null;
  preview_url: string;
  discount_type: DiscountType | "";
  discount_value: string;
  start_date: string;
  end_date: string;
  errorMessage: string | null;
}

const INITIAL_STATE: PromoFormModalState = {
  menu_item_id: "",
  name: "",
  photo_file: null,
  preview_url: "",
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

  private handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const preview_url = URL.createObjectURL(file);
      this.setState({ photo_file: file, preview_url, errorMessage: null });
    }
  };

  private handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    const {
      menu_item_id,
      name,
      photo_file,
      discount_type,
      discount_value,
      start_date,
      end_date,
    } = this.state;
    const { onSave } = this.props;

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
    today.setHours(0, 0, 0, 0);

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

    const formData = new FormData();
    formData.append("menu_item_id", menu_item_id);
    formData.append("name", name);
    formData.append("discount_type", discount_type);
    formData.append("discount_value", valueNum.toString());
    formData.append("start_date", start_date);
    formData.append("end_date", end_date);

    if (photo_file) {
      formData.append("photo", photo_file);
    }

    onSave(formData);
  };

  render() {
    const { isOpen, onClose, isSubmitting, myProducts } = this.props;
    const {
      menu_item_id,
      name,
      preview_url,
      discount_type,
      discount_value,
      start_date,
      end_date,
      errorMessage,
    } = this.state;

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
        <div className="bg-[#FFD13B] w-full max-w-4xl rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
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
            <div className="flex flex-col items-center mb-8">
              <label
                htmlFor="promo_photo_upload"
                className="cursor-pointer w-28 h-28 bg-white rounded-full flex justify-center items-center shadow-sm mb-4 hover:scale-105 transition-transform overflow-hidden relative border-4 border-white group"
                title="Klik untuk memilih foto banner"
              >
                {preview_url ? (
                  <>
                    <img
                      src={preview_url}
                      alt="Preview Banner"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold">Ubah</span>
                    </div>
                  </>
                ) : (
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </label>

              <h2 className="text-[#1B2B65] font-bold text-lg mb-2">
                Upload Banner Promo
              </h2>

              <input
                id="promo_photo_upload"
                type="file"
                accept="image/*"
                onChange={this.handleFileChange}
                className="hidden"
              />
            </div>

            {errorMessage && (
              <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md font-medium shadow-sm">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[#1B2B65] font-bold">
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
                  <div className="relative">
                    <select
                      id="promo_product"
                      required
                      name="menu_item_id"
                      value={menu_item_id}
                      onChange={this.handleInputChange}
                      className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal appearance-none cursor-pointer"
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
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label htmlFor="discount_type" className="block mb-2 text-lg">
                    Tipe Diskon
                  </label>
                  <div className="relative">
                    <select
                      id="discount_type"
                      required
                      name="discount_type"
                      value={discount_type}
                      onChange={this.handleInputChange}
                      className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal appearance-none cursor-pointer"
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
                  <label
                    htmlFor="discount_value"
                    className="block mb-2 text-lg"
                  >
                    Nilai Diskon{" "}
                    <span className="font-normal text-base">
                      {discount_type === DiscountType.PERCENTAGE
                        ? "(%)"
                        : "(Rp)"}
                    </span>
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
                    className="w-full px-5 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1B2B65] font-normal cursor-pointer"
                  />
                </div>
              </div>
            </div>

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
