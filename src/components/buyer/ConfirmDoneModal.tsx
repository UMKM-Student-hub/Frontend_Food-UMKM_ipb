import { Component } from "react";

interface ConfirmDoneModalProps {
  isOpen: boolean;
  orderId: number | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export class ConfirmDoneModal extends Component<ConfirmDoneModalProps> {
  render() {
    const { isOpen, orderId, isSubmitting, onClose, onConfirm } = this.props;

    if (!isOpen || orderId === null) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity"
        style={{
          backgroundColor: "rgba(27, 43, 101, 0.6)",
          backdropFilter: "blur(4px)",
        }}
        onClick={isSubmitting ? undefined : onClose}
      >
        <div
          className="bg-white rounded-3xl w-full max-w-md p-8 md:p-10 shadow-2xl animate-fadeIn relative flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white ring-4 ring-gray-50">
            <svg
              className="w-10 h-10 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-[#1B2B65] text-center mb-3 tracking-wide">
            Pesanan Diterima?
          </h3>

          <p className="text-gray-500 text-center mb-8 font-medium leading-relaxed">
            Pastikan kamu sudah menerima makanan sesuai pesananmu sebelum
            menyelesaikan transaksi ini.
          </p>

          <div className="flex w-full gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-5 py-3.5 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 focus:outline-none"
            >
              Batal
            </button>
            <button
              onClick={() => onConfirm(orderId)}
              disabled={isSubmitting}
              className="flex-1 px-5 py-3.5 rounded-2xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50 gap-2 shadow-md focus:outline-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                "Ya, Selesai"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
