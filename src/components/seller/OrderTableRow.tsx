import { Component } from "react";
import type { Order } from "../../domain/Order";
import { OrderStatus } from "../../domain/enums";
import type { TabType } from "./OrderTabs";

interface OrderTableRowProps {
  order: Order;
  activeTab: TabType;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onMarkReady: (id: number) => void;
}

export class OrderTableRow extends Component<OrderTableRowProps> {
  private formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  private getFullImageUrl(path: string | undefined | null): string {
    if (!path) return "";
    return path.startsWith("/") ? `http://localhost:8000${path}` : path;
  }

  private renderActionColumn = () => {
    const { order, activeTab, onAccept, onReject, onMarkReady } = this.props;

    switch (activeTab) {
      case "masuk":
        return (
          <div className="flex items-center justify-start md:justify-center gap-3 w-full">
            <button
              onClick={() => onAccept(order.id)}
              className="flex-1 md:flex-none bg-[#D1F2EB] text-[#117A65] font-bold px-5 py-2.5 md:py-2 rounded-xl hover:bg-[#A3E4D7] transition-colors text-sm focus:outline-none"
            >
              TERIMA
            </button>
            <button
              onClick={() => onReject(order.id)}
              className="flex-1 md:flex-none bg-[#FADBD8] text-[#CB4335] font-bold px-5 py-2.5 md:py-2 rounded-xl hover:bg-[#F5B7B1] transition-colors text-sm focus:outline-none"
            >
              TOLAK
            </button>
          </div>
        );

      case "proses":
        if (order.status === OrderStatus.READY) {
          return (
            <span className="w-full md:w-auto border border-[#FFB20E] bg-[#FFF8E7] text-[#FFB20E] font-bold px-4 py-2.5 md:py-2 rounded-xl inline-block text-xs uppercase tracking-wider text-center">
              Menunggu Diambil
            </span>
          );
        }
        return (
          <button
            onClick={() => onMarkReady(order.id)}
            className="w-full md:w-auto bg-[#D1F2EB] text-[#117A65] font-bold px-8 py-2.5 md:py-2 rounded-xl hover:bg-[#A3E4D7] transition-colors text-sm focus:outline-none"
          >
            SELESAI
          </button>
        );

      case "selesai":
        return (
          <span className="w-full md:w-auto border border-gray-300 bg-white text-gray-700 font-bold px-8 py-2.5 md:py-2 rounded-xl inline-block text-sm shadow-sm text-center">
            SELESAI
          </span>
        );

      case "batal":
        return (
          <span className="w-full md:w-auto border border-red-200 bg-red-50 text-red-600 font-bold px-8 py-2.5 md:py-2 rounded-xl inline-block text-sm text-center">
            DIBATALKAN
          </span>
        );

      default:
        return null;
    }
  };

  render() {
    const { order } = this.props;

    const buyerName =
      (order as any).buyer_name ||
      (order as any).buyerName ||
      (order as any).customer_name ||
      `Customer #${order.buyer_id}`;
    const formattedId = String(order.id).padStart(5, "0");
    const paymentMethod = (order as any).payment_method || "CASH";
    const paymentProof =
      (order as any).payment_proof_url || (order as any).payment_proof;

    return (
      <tr className="block md:table-row bg-white rounded-3xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-0 md:border-b border-b-gray-200 hover:bg-gray-50/50 transition-colors text-sm md:text-base mb-5 md:mb-0 overflow-hidden align-top">
        <td className="block md:table-cell py-4 md:py-5 px-5 md:px-6 border-b border-gray-50 md:border-0 md:pt-6">
          <div className="flex md:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            ID Pesanan
          </div>
          <div className="text-gray-600 font-bold md:font-medium">
            {formattedId}
          </div>
        </td>

        <td className="block md:table-cell py-4 md:py-5 px-5 md:px-6 border-b border-gray-50 md:border-0 md:pt-6">
          <div className="flex md:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Nama Pemesan
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0 shadow-sm border border-blue-200">
              {buyerName.charAt(0).toUpperCase()}
            </div>
            <div className="font-bold text-[#1B2B65] md:text-gray-800 text-lg md:text-base">
              {buyerName}
            </div>
          </div>
        </td>

        <td className="block md:table-cell py-4 md:py-5 px-5 md:px-6 border-b border-gray-50 md:border-0">
          <div className="flex md:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Detail Pesanan
          </div>
          <ul className="flex flex-col gap-4 md:gap-3">
            {order.items.map((item) => {
              const note = (item as any).notes || (item as any).note;
              return (
                <li
                  key={item.menu_item_id || item.id}
                  className="flex flex-col gap-1.5"
                >
                  <div className="flex items-start gap-2">
                    <span className="bg-red-50 text-red-600 font-bold text-xs px-2 py-0.5 rounded shrink-0">
                      {item.quantity}x
                    </span>
                    <span className="text-gray-700 font-medium leading-tight">
                      {item.menu_name}
                    </span>
                  </div>
                  {note && note.trim() !== "" && (
                    <div className="ml-8 bg-yellow-50/50 border border-yellow-100 rounded-lg text-[11px] text-gray-600 font-medium px-2.5 py-1.5 italic w-fit">
                      <span className="font-bold mr-1 text-[#FFB20E]">
                        Catatan:
                      </span>
                      {note}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </td>

        <td className="block md:table-cell py-4 md:py-5 px-5 md:px-6 border-b border-gray-50 md:border-0 md:pt-6">
          <div className="flex md:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Total & Pembayaran
          </div>
          <div className="font-black text-[#FFB20E] text-lg md:text-base">
            {this.formatRupiah(order.total_price)}
          </div>

          <div className="mt-2.5 flex flex-col items-start gap-2">
            <span className="text-[10px] font-extrabold text-[#1B2B65] uppercase tracking-wider bg-gray-100 px-2 py-1 rounded border border-gray-200 shadow-sm">
              {paymentMethod}
            </span>

            {paymentProof && (
              <a
                href={this.getFullImageUrl(paymentProof)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors shadow-sm"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                Lihat Bukti
              </a>
            )}
          </div>
        </td>

        <td className="block md:table-cell py-4 md:py-5 px-5 md:px-6 bg-gray-50/30 md:bg-transparent align-top md:pt-6">
          <div className="flex justify-start md:justify-center items-start w-full h-full">
            {this.renderActionColumn()}
          </div>
        </td>
      </tr>
    );
  }
}
