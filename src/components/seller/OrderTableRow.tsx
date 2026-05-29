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

  private renderActionColumn = () => {
    const { order, activeTab, onAccept, onReject, onMarkReady } = this.props;

    switch (activeTab) {
      case "masuk":
        return (
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              onClick={() => onAccept(order.id)}
              className="bg-[#D1F2EB] text-[#117A65] font-bold px-5 py-2 rounded hover:bg-[#A3E4D7] transition-colors text-sm focus:outline-none"
            >
              TERIMA
            </button>
            <button
              onClick={() => onReject(order.id)}
              className="bg-[#FADBD8] text-[#CB4335] font-bold px-5 py-2 rounded hover:bg-[#F5B7B1] transition-colors text-sm focus:outline-none"
            >
              TOLAK
            </button>
          </div>
        );

      case "proses":
        if (order.status === OrderStatus.READY) {
          return (
            <span className="border border-[#FFB20E] bg-[#FFF8E7] text-[#FFB20E] font-bold px-4 py-2 rounded inline-block text-xs uppercase tracking-wider text-center">
              Menunggu Diambil
            </span>
          );
        }
        return (
          <button
            onClick={() => onMarkReady(order.id)}
            className="bg-[#D1F2EB] text-[#117A65] font-bold px-5 py-2 rounded hover:bg-[#A3E4D7] transition-colors text-sm focus:outline-none"
          >
            SELESAI
          </button>
        );

      case "selesai":
        return (
          <span className="border border-gray-300 bg-white text-gray-700 font-bold px-5 py-2 rounded inline-block text-sm shadow-sm text-center">
            SELESAI
          </span>
        );

      case "batal":
        return (
          <span className="border border-red-200 bg-red-50 text-red-600 font-bold px-5 py-2 rounded inline-block text-sm text-center">
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
      (order as any).buyer_name || `Customer #${order.buyer_id}`;

    const formattedId = String(order.id).padStart(5, "0");

    return (
      <tr className="border-b border-gray-200 bg-white hover:bg-gray-50/50 transition-colors text-sm md:text-base">
        <td className="py-5 px-6 text-gray-600 font-medium">{formattedId}</td>
        <td className="py-5 px-6 font-medium text-gray-800">{buyerName}</td>
        <td className="py-5 px-6 text-gray-700">
          <ul className="flex flex-col gap-1">
            {order.items.map((item) => (
              <li key={item.menu_item_id || item.id}>
                <span className="text-red-500 font-semibold">
                  {item.quantity} x
                </span>{" "}
                {item.menu_name}
              </li>
            ))}
          </ul>
        </td>
        <td className="py-5 px-6 font-medium text-gray-800">
          {this.formatRupiah(order.total_price)}
        </td>
        <td className="py-5 px-6 align-middle">
          <div className="flex justify-center items-center w-full h-full">
            {this.renderActionColumn()}
          </div>
        </td>
      </tr>
    );
  }
}
