import { Component } from "react";
import type { ChangeEvent, FormEvent } from "react";

interface RejectOrderModalProps {
  isOpen: boolean;
  orderId: number | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (orderId: number, reason: string) => void;
}

interface RejectOrderModalState {
  reason: string;
  errorMessage: string | null;
}

export class RejectOrderModal extends Component<
  RejectOrderModalProps,
  RejectOrderModalState
> {
  constructor(props: RejectOrderModalProps) {
    super(props);
    this.state = {
      reason: "",
      errorMessage: null,
    };
  }

  componentDidUpdate(prevProps: RejectOrderModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({ reason: "", errorMessage: null });
    }
  }

  private handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ reason: e.target.value, errorMessage: null });
  };

  private handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const { reason } = this.state;
    const { orderId, onConfirm } = this.props;

    if (!reason.trim()) {
      this.setState({ errorMessage: "Alasan penolakan tidak boleh kosong." });
      return;
    }

    if (reason.trim().length < 5) {
      this.setState({ errorMessage: "Alasan penolakan minimal 5 karakter." });
      return;
    }

    if (orderId !== null) {
      onConfirm(orderId, reason.trim());
    }
  };

  render() {
    const { isOpen, onClose, isSubmitting, orderId } = this.props;
    const { reason, errorMessage } = this.state;

    if (!isOpen || orderId === null) return null;

    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-700">Tolak Pesanan</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold"
              aria-label="Tutup Modal"
            >
              &times;
            </button>
          </div>

          <form onSubmit={this.handleSubmit} className="p-6">
            <p className="text-gray-600 mb-4 font-medium text-sm">
              Pesanan{" "}
              <span className="font-bold text-gray-800">
                #{String(orderId).padStart(5, "0")}
              </span>{" "}
              akan dibatalkan. Berikan alasan yang jelas kepada pembeli.
            </p>

            <label
              htmlFor="rejection_reason"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejection_reason"
              rows={4}
              value={reason}
              onChange={this.handleTextChange}
              placeholder="Contoh: Maaf, stok ayam bakar baru saja habis."
              className={`w-full px-4 py-3 rounded-xl border ${
                errorMessage
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#1B2B65]"
              } focus:outline-none focus:ring-2 bg-gray-50 transition-colors resize-none`}
            />

            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 font-medium">
                {errorMessage}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Tolak Pesanan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
