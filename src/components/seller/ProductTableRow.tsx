import { Component } from "react";
import type { MenuItem } from "../../domain/MenuItem";

interface ProductTableRowProps {
  product: MenuItem;
  onEdit: (product: MenuItem) => void;
  onDelete: (id: number) => void;
}

export class ProductTableRow extends Component<ProductTableRowProps> {
  // Method untuk memformat harga menjadi Rupiah
  private formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // Pada Figma terlihat menggunakan simbol $ pada beberapa desain, namun jika wajib Rp, ubah menjadi id-ID dan IDR
    })
      .format(number)
      .replace("$", "$ "); // Sesuaikan format dengan desain Figma
  };

  render() {
    const { product, onEdit, onDelete } = this.props;

    return (
      <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors bg-white">
        {/* Kolom Foto */}
        <td className="py-4 px-6">
          <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
            {product.photo_url ? (
              <img
                src={product.photo_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-xs font-medium">
                No Image
              </span>
            )}
          </div>
        </td>

        {/* Kolom Nama Produk */}
        <td className="py-4 px-6 font-medium text-gray-800">{product.name}</td>

        {/* Kolom Jenis Makanan */}
        <td className="py-4 px-6 text-gray-600 capitalize">
          {product.category.replace("_", " ")}
        </td>

        {/* Kolom Harga */}
        <td className="py-4 px-6 text-gray-800 font-medium">
          {this.formatRupiah(product.price)}
        </td>

        {/* Kolom Stok */}
        <td className="py-4 px-6 text-gray-600">{product.stock}</td>

        {/* Kolom Action */}
        <td className="py-4 px-6 text-center">
          <div className="flex items-center justify-center gap-2">
            {/* Tombol Edit */}
            <button
              onClick={() => onEdit(product)}
              className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:border-[#1B2B65] hover:text-[#1B2B65] transition-colors"
              title="Edit Produk"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            {/* Tombol Delete */}
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors"
              title="Hapus Produk"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    );
  }
}
