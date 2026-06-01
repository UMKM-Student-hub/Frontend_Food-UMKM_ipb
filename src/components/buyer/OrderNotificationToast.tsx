import { Component } from "react";

interface OrderNotificationToastProps {
  isOpen: boolean;
  orderId: number;
  message: string;
  onAction: () => void;
  onClose: () => void;
}

export class OrderNotificationToast extends Component<OrderNotificationToastProps> {
  componentDidUpdate(prevProps: OrderNotificationToastProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      setTimeout(() => {
        this.props.onClose();
      }, 6000);
    }
  }

  render() {
    const { isOpen, orderId, message, onAction, onClose } = this.props;

    if (!isOpen) return null;

    const formattedId = String(orderId).padStart(5, "0");

    return (
      <div className="fixed top-24 right-4 sm:right-6 z-100 w-full max-w-sm bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,43,101,0.15)] border border-gray-100 p-4 flex gap-4 animate-slideIn transition-all">
        <div className="bg-green-50 text-green-500 p-3 rounded-xl shrink-0 h-12 w-12 flex items-center justify-center border border-green-100 shadow-sm">
          <svg
            className="w-6 h-6 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Pesanan #{formattedId}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 font-bold text-sm outline-none focus:outline-none"
            >
              ✕
            </button>
          </div>
          <h4 className="text-[#1B2B65] font-extrabold text-base mb-1">
            Makanan Siap Diambil!
          </h4>
          <p className="text-gray-500 text-sm font-medium leading-normal mb-3">
            {message}
          </p>
          <button
            onClick={onAction}
            className="text-xs font-black text-[#1B2B65] bg-[#FFB20E] hover:bg-[#F0A500] px-4 py-2 rounded-lg transition-colors shadow-sm focus:outline-none"
          >
            Lihat Pesanan
          </button>
        </div>
      </div>
    );
  }
}
