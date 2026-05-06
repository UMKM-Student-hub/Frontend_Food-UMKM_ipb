import { Component } from "react";

interface StoreStatusToggleProps {
  isOpen: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export class StoreStatusToggle extends Component<StoreStatusToggleProps> {
  render() {
    const { isOpen, isLoading, onToggle } = this.props;

    return (
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 min-w-[250px]">
        {/* Teks Status */}
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Status Kantin
          </span>
          <span
            className={`text-xl font-extrabold transition-colors ${
              isOpen ? "text-green-500" : "text-red-500"
            }`}
          >
            {isOpen ? "BUKA" : "TUTUP"}
          </span>
        </div>

        {/* Tombol Toggle Switch ala iOS */}
        <button
          type="button"
          role="switch"
          aria-checked={isOpen ? "true" : "false"}
          onClick={onToggle}
          disabled={isLoading}
          className={`relative inline-flex h-9 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1B2B65] focus:ring-offset-2 ${
            isOpen ? "bg-green-500" : "bg-gray-300"
          } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
        >
          <span className="sr-only">Toggle Status Toko</span>

          {/* Lingkaran Putih di dalam Switch */}
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isOpen ? "translate-x-8" : "translate-x-0.5"
            }`}
          >
            {/* Tampilkan spinner loading (opsional) saat API dipanggil */}
            {isLoading && (
              <svg
                className="animate-spin h-full w-full text-gray-400 p-1.5"
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
            )}
          </span>
        </button>
      </div>
    );
  }
}
