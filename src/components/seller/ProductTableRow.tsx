import { Component } from "react";
import type { MenuItem } from "../../domain/MenuItem";

interface ProductTableRowProps {
  product: MenuItem;
  onEdit: (product: MenuItem) => void;
  onDelete: (id: number) => void;
}

export class ProductTableRow extends Component<ProductTableRowProps> {
  private formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  render() {
    const { product, onEdit, onDelete } = this.props;

    const imageUrl = product.photo_url?.startsWith("/")
      ? `http://localhost:8000${product.photo_url}`
      : product.photo_url;

    return (
      <tr className="block md:table-row border-b border-gray-200 md:border-gray-100 hover:bg-gray-50/50 transition-colors bg-white p-4 md:p-0 mb-4 md:mb-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none">
        <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
          <div className="flex justify-center md:justify-start mb-4 md:mb-0">
            <div className="w-32 h-32 md:w-16 md:h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs font-medium">
                  No Image
                </span>
              )}
            </div>
          </div>
        </td>

        <td className="flex md:table-cell justify-between items-center py-2 md:py-4 px-2 md:px-6 border-b border-gray-50 md:border-none">
          <span className="md:hidden font-bold text-xs text-gray-500 uppercase tracking-wider">
            Nama Produk
          </span>
          <span className="font-bold md:font-medium text-gray-800 text-right md:text-left text-base">
            {product.name}
          </span>
        </td>

        <td className="flex md:table-cell justify-between items-center py-2 md:py-4 px-2 md:px-6 border-b border-gray-50 md:border-none">
          <span className="md:hidden font-bold text-xs text-gray-500 uppercase tracking-wider">
            Jenis Makanan
          </span>
          <span className="text-gray-600 capitalize text-right md:text-left font-medium md:font-normal">
            {product.category.replace("_", " ")}
          </span>
        </td>

        <td className="flex md:table-cell justify-between items-center py-2 md:py-4 px-2 md:px-6 border-b border-gray-50 md:border-none">
          <span className="md:hidden font-bold text-xs text-gray-500 uppercase tracking-wider">
            Harga
          </span>
          <span className="text-gray-800 font-bold text-right md:text-left">
            {this.formatRupiah(product.price)}
          </span>
        </td>

        <td className="flex md:table-cell justify-between items-center py-2 md:py-4 px-2 md:px-6 border-b border-gray-50 md:border-none">
          <span className="md:hidden font-bold text-xs text-gray-500 uppercase tracking-wider">
            Stok
          </span>
          <span className="text-gray-600 font-medium md:font-normal text-right md:text-left">
            {product.stock}
          </span>
        </td>

        <td className="flex md:table-cell justify-between items-center py-4 md:py-4 px-2 md:px-6 text-center mt-2 md:mt-0">
          <span className="md:hidden font-bold text-xs text-gray-500 uppercase tracking-wider">
            Aksi
          </span>
          <div className="flex items-center justify-end md:justify-center gap-3">
            <button
              onClick={() => onEdit(product)}
              className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-[#FFD13B] hover:border-[#FFD13B] hover:text-[#1B2B65] transition-colors"
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

            <button
              onClick={() => onDelete(product.id)}
              className="p-2 border border-red-200 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors"
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
