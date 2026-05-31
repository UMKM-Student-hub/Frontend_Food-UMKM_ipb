import { Component } from "react";

interface ClosedStoreModalProps {
  isOpen: boolean;
  storeName: string;
  onClose: () => void;
}

export class ClosedStoreModal extends Component<ClosedStoreModalProps> {
  render() {
    const { isOpen, storeName, onClose } = this.props;

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity animate-fadeIn"
        style={{
          backgroundColor: "rgba(27, 43, 101, 0.6)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative flex flex-col items-center transform transition-all scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white ring-4 ring-gray-50">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-black text-[#1B2B65] text-center mb-3 tracking-wide">
            Kantin Tutup
          </h3>

          <p className="text-gray-500 text-center mb-8 font-medium leading-relaxed text-sm">
            Maaf, <strong className="text-[#1B2B65]">{storeName}</strong> saat
            ini sedang tutup dan tidak dapat menerima pesanan. Silakan kembali
            lagi nanti!
          </p>

          <button
            onClick={onClose}
            className="w-full px-5 py-3.5 rounded-2xl font-bold text-white bg-[#1B2B65] hover:bg-[#102A71] transition-colors shadow-md focus:outline-none"
          >
            Mengerti
          </button>
        </div>
      </div>
    );
  }
}
