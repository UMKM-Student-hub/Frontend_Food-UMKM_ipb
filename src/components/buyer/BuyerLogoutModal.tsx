import { Component } from "react";

interface BuyerLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export class BuyerLogoutModal extends Component<BuyerLogoutModalProps> {
  render() {
    const { isOpen, onClose, onConfirm } = this.props;

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
        <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl p-8 flex flex-col items-center text-center transform transition-all">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-[#1B2B65] mb-3">
            Keluar Akun
          </h3>
          <p className="text-gray-500 font-medium mb-8 text-sm leading-relaxed">
            Apakah Anda yakin ingin keluar? Anda harus login kembali untuk
            melakukan pemesanan.
          </p>

          <div className="flex w-full gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3.5 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors shadow-md"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      </div>
    );
  }
}
