import { Component, ReactNode } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export class ConfirmModal extends Component<ConfirmModalProps> {
  render() {
    const {
      isOpen,
      title,
      message,
      confirmText = "Ya",
      cancelText = "Batal",
      type = "warning",
      isLoading = false,
      onConfirm,
      onClose,
    } = this.props;

    if (!isOpen) return null;

    let iconBg, iconColor, btnBg, iconSvg;

    if (type === "danger") {
      iconBg = "bg-red-50";
      iconColor = "text-red-500";
      btnBg = "bg-red-600 hover:bg-red-700 text-white";
      iconSvg = (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );
    } else if (type === "info") {
      iconBg = "bg-blue-50";
      iconColor = "text-blue-500";
      btnBg = "bg-blue-600 hover:bg-blue-700 text-white";
      iconSvg = (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    } else {
      iconBg = "bg-yellow-50";
      iconColor = "text-[#FFB20E]";
      btnBg = "bg-[#1B2B65] hover:bg-[#102A71] text-white";
      iconSvg = (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }

    return (
      <div
        className="fixed inset-0 z-100 flex items-center justify-center p-4 transition-opacity animate-fadeIn"
        style={{
          backgroundColor: "rgba(27, 43, 101, 0.6)",
          backdropFilter: "blur(4px)",
        }}
        onClick={isLoading ? undefined : onClose}
      >
        <div
          className="bg-white rounded-3xl w-full max-w-sm p-6 md:p-8 shadow-2xl relative flex flex-col items-center transform transition-all scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`w-16 h-16 ${iconBg} ${iconColor} rounded-full flex items-center justify-center mb-5 shadow-sm ring-4 ring-white`}
          >
            {iconSvg}
          </div>

          <h3 className="text-xl md:text-2xl font-black text-[#1B2B65] text-center mb-2">
            {title}
          </h3>

          <div className="text-gray-500 text-center mb-8 font-medium text-sm md:text-base leading-relaxed">
            {message}
          </div>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none disabled:opacity-50 flex justify-center items-center gap-2 ${btnBg}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
