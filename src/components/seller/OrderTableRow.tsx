import { Component } from "react";
import type { Order } from "../../domain/Order";
import type { TabType } from "./OrderTabs";

interface OrderTableRowProps {
  order: Order;
  activeTab: TabType;
  // Fungsi-fungsi aksi yang akan dipanggil kembali ke parent component
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onMarkReady: (id: number) => void;
}

export class OrderTableRow extends Component<OrderTableRowProps> {
  // Method untuk memformat angka menjadi Rupiah (Rp 120.000)
  private formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Method ini mengeksekusi Pola Adaptif: Me-render tombol yang berbeda sesuai Tab
  private renderActionColumn = () => {
    const { order, activeTab, onAccept, onReject, onMarkReady } = this.props;

    switch (activeTab) {
      case "masuk":
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onAccept(order.id)}
              className="bg-[#D1F2EB] text-[#117A65] font-bold px-5 py-2 rounded hover:bg-[#A3E4D7] transition-colors text-sm"
            >
              TERIMA
            </button>
            <button
              onClick={() => onReject(order.id)}
              className="bg-[#FADBD8] text-[#CB4335] font-bold px-5 py-2 rounded hover:bg-[#F5B7B1] transition-colors text-sm"
            >
              TOLAK
            </button>
          </div>
        );

      case "proses":
        return (
          <button
            onClick={() => onMarkReady(order.id)}
            className="bg-[#D1F2EB] text-[#117A65] font-bold px-5 py-2 rounded hover:bg-[#A3E4D7] transition-colors text-sm"
          >
            SELESAI
          </button>
        );

      case "selesai":
        return (
          <span className="border border-gray-300 bg-white text-gray-700 font-bold px-5 py-2 rounded inline-block text-sm shadow-sm">
            SELESAI
          </span>
        );

      case "batal":
        return (
          <span className="border border-red-200 bg-red-50 text-red-600 font-bold px-5 py-2 rounded inline-block text-sm">
            DIBATALKAN
          </span>
        );

      default:
        return null;
    }
  };

  render() {
    const { order } = this.props;

    // Catatan: Jika backend belum merespons buyer_name secara eksplisit di tabel Order,
    // kita sementara menggunakan fallback ini. Nanti bisa disesuaikan jika DTO berubah.
    const buyerName =
      (order as any).buyer_name || `Customer #${order.buyer_id}`;

    // Format ID menjadi 5 digit sesuai Figma (Contoh: 00001)
    const formattedId = String(order.id).padStart(5, "0");

    return (
      <tr className="border-b border-gray-200 bg-white hover:bg-gray-50/50 transition-colors text-sm md:text-base">
        {/* Kolom ID */}
        <td className="py-5 px-6 text-gray-600 font-medium">{formattedId}</td>

        {/* Kolom Nama Pemesan */}
        <td className="py-5 px-6 font-medium text-gray-800">{buyerName}</td>

        {/* Kolom Daftar Pesanan (Item) */}
        <td className="py-5 px-6 text-gray-700">
          <ul className="flex flex-col gap-1">
            {order.items.map((item) => (
              <li key={item.id}>
                {/* Desain Figma menggunakan warna merah untuk quantity */}
                <span className="text-red-500 font-semibold">
                  {item.quantity} x
                </span>{" "}
                {item.menu_name}
              </li>
            ))}
          </ul>
        </td>

        {/* Kolom Total Harga */}
        <td className="py-5 px-6 font-medium text-gray-800">
          {this.formatRupiah(order.total_price)}
        </td>

        {/* Kolom Aksi Dinamis */}
        <td className="py-5 px-6">{this.renderActionColumn()}</td>
      </tr>
    );
  }
}
