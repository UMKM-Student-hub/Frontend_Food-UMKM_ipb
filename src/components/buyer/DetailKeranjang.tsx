import { Component } from "react";
import type { MenuItem } from "../../domain/MenuItem";

export interface CartItem {
  item: MenuItem;
  quantity: number;
  note?: string;
}

interface DetailKeranjangProps {
  isOpen: boolean;
  cartItems: CartItem[];
  isSubmitting: boolean;
  onClose: () => void;
  onCheckout: (paymentMethod: string, paymentProof: File | null) => void;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onUpdateNote: (itemId: number, note: string) => void;
  onRemoveItem: (itemId: number) => void;
}

interface DetailKeranjangState {
  paymentMethod: string;
  paymentProof: File | null;
}

export class DetailKeranjang extends Component<
  DetailKeranjangProps,
  DetailKeranjangState
> {
  constructor(props: DetailKeranjangProps) {
    super(props);
    this.state = {
      paymentMethod: "",
      paymentProof: null,
    };
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(price);
  }

  private getTotalPrice(): number {
    return this.props.cartItems.reduce(
      (total, ci) => total + ci.item.price * ci.quantity,
      0,
    );
  }

  render() {
    const {
      isOpen,
      cartItems,
      isSubmitting,
      onClose,
      onCheckout,
      onUpdateQuantity,
      onUpdateNote,
    } = this.props;
    const { paymentMethod, paymentProof } = this.state;

    if (!isOpen) return null;

    const totalPrice = this.getTotalPrice();
    const isCheckoutDisabled =
      !paymentMethod || (paymentMethod === "Gopay" && !paymentProof);

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity"
        style={{
          backgroundColor: "rgba(27, 43, 101, 0.6)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      >
        <div
          className="bg-white w-full sm:max-w-2xl rounded-[2rem] shadow-2xl flex flex-col relative animate-slideUp sm:animate-fadeIn p-8 md:p-10"
          style={{
            maxHeight: "90vh",
            overflowY: "auto",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-6 right-6 text-gray-400 hover:text-[#1B2B65] transition-colors focus:outline-none z-10 bg-white/80 rounded-full p-1 disabled:opacity-50"
          >
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 className="text-[#1B2B65] text-2xl md:text-3xl font-black mb-8 uppercase tracking-wide">
            KERANJANGKU
          </h2>

          <div className="flex justify-between items-center border-b-2 border-[#1B2B65]/10 pb-3 mb-4">
            <span className="text-[#1B2B65] font-bold text-lg md:text-xl">
              Item
            </span>
            <span className="text-[#1B2B65] font-bold text-lg md:text-xl">
              Harga
            </span>
          </div>

          <div className="flex flex-col gap-5 mb-6">
            {cartItems.length === 0 ? (
              <div className="text-[#1B2B65]/60 font-medium text-center py-8">
                Keranjang masih kosong
              </div>
            ) : (
              cartItems.map(({ item, quantity, note }) => (
                <div
                  key={item.id}
                  className="flex flex-col border-b border-gray-100 pb-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[#1B2B65] font-medium text-lg md:text-xl flex-1 truncate pr-4">
                      {item.name}
                    </div>

                    <div className="flex items-center border-[1.5px] border-[#1B2B65] rounded-full px-2 py-0.5 bg-white shrink-0 mr-4 md:mr-8">
                      <button
                        onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                        disabled={isSubmitting}
                        className="w-8 h-8 flex items-center justify-center text-[#FFB20E] font-black text-2xl hover:bg-gray-50 rounded-full transition-all disabled:opacity-30 focus:outline-none pb-1"
                      >
                        −
                      </button>
                      <span className="text-[#1B2B65] font-bold w-6 text-center text-lg select-none">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                        disabled={quantity >= item.stock || isSubmitting}
                        className="w-8 h-8 flex items-center justify-center text-[#FFB20E] font-black text-2xl hover:bg-gray-50 rounded-full transition-all disabled:opacity-30 focus:outline-none pb-1"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-[#FFB20E] font-bold text-lg md:text-xl w-20 md:w-28 text-right shrink-0">
                      {this.formatPrice(item.price)}
                    </div>
                  </div>

                  <div className="w-full">
                    <input
                      type="text"
                      value={note || ""}
                      onChange={(e) => onUpdateNote(item.id, e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Tambah catatan (opsional)..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[#1B2B65] text-sm focus:outline-none focus:border-[#FFB20E] transition-all disabled:opacity-60"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="flex flex-col mt-auto">
              <div className="flex justify-end items-center gap-6 md:gap-10 pt-4 mb-8 border-t-2 border-[#1B2B65]/10">
                <span className="text-[#1B2B65] text-lg md:text-xl font-bold">
                  Subtotal
                </span>
                <span className="text-[#FFB20E] text-xl md:text-2xl font-bold w-20 md:w-28 text-right">
                  {this.formatPrice(totalPrice)}
                </span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-[#1B2B65] text-lg md:text-xl font-medium">
                  Metode Pembayaran
                </span>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    disabled={isSubmitting}
                    onChange={(e) =>
                      this.setState({
                        paymentMethod: e.target.value,
                        paymentProof: null,
                      })
                    }
                    className="appearance-none border-2 border-[#1B2B65] rounded-full px-5 py-2 text-[#1B2B65] font-bold text-base md:text-lg focus:outline-none bg-white pr-10 cursor-pointer disabled:opacity-60"
                  >
                    <option value="" disabled>
                      Pilih Metode
                    </option>
                    <option value="Bayar Ditempat">Bayar Ditempat</option>
                    <option value="Gopay">Gopay</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[#1B2B65]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {paymentMethod === "Gopay" && (
                <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-2xl animate-fadeIn">
                  <div className="text-[#1B2B65] text-lg md:text-xl font-medium mb-4">
                    Transfer ke Gopay :{" "}
                    <span className="font-bold">0812673839</span>
                  </div>
                  <label className="block text-[#1B2B65] text-sm font-bold mb-2">
                    Unggah Bukti Pembayaran
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isSubmitting}
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      this.setState({ paymentProof: file });
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#FFB20E]/20 file:text-[#1B2B65] hover:file:bg-[#FFB20E]/30 transition-all cursor-pointer bg-white border border-gray-200 rounded-2xl p-2 focus:outline-none disabled:opacity-60"
                  />
                </div>
              )}

              <button
                onClick={() => onCheckout(paymentMethod, paymentProof)}
                disabled={isCheckoutDisabled || isSubmitting}
                className="w-full bg-[#1B2B65] hover:bg-[#102A71] active:scale-95 text-white font-bold text-xl py-4 rounded-full transition-all shadow-md focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  "Pesan"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
