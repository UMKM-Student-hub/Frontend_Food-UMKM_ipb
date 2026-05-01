import { Component } from "react";
import type { MenuItem } from "../../domain/MenuItem"; // Interface tetap menggunakan type-only import

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

interface MenuCardState {
  quantity: number;
}

export class MenuCard extends Component<MenuCardProps, MenuCardState> {
  constructor(props: MenuCardProps) {
    super(props);
    this.state = {
      quantity: 1, // State dikelola secara internal di dalam class
    };
  }

  private updateQuantity = (delta: number): void => {
    this.setState((prevState) => ({
      quantity: Math.max(1, prevState.quantity + delta),
    }));
  };

  render() {
    const { item, onAddToCart } = this.props;
    const { quantity } = this.state;

    return (
      <div className="bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-md h-full">
        {/* Gambar Menu */}
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={item.photo_url || "/images/makanan.png"} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 flex flex-col items-center text-center flex-grow">
          <span className="text-[#FBBF24] font-black text-2xl mb-2">
            {item.price.toLocaleString("id-ID")}
          </span>
          <h3 className="text-[#1E3A8A] font-bold text-xl mb-3">{item.name}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
            {item.description}
          </p>

          <div className="flex items-center gap-4 mt-auto">
            {/* Kontrol Kuantitas */}
            <div className="flex items-center border-2 border-[#1E3A8A] rounded-full px-2 py-1 bg-white">
              <button
                onClick={() => this.updateQuantity(-1)}
                className="w-8 h-8 flex items-center justify-center bg-[#FBBF24]/20 rounded-full text-[#FBBF24] font-bold text-xl cursor-pointer"
              >
                -
              </button>
              <span className="px-4 font-bold text-[#1E3A8A] text-lg w-10">
                {quantity}
              </span>
              <button
                onClick={() => this.updateQuantity(1)}
                className="w-8 h-8 flex items-center justify-center bg-[#FBBF24] rounded-full text-white font-bold text-xl cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Tombol Keranjang - Update styling Biru Tua & Border Kuning */}
            <button
              onClick={() => onAddToCart(item, quantity)}
              className="w-14 h-14 bg-[#1E3A8A] border-4 border-[#FBBF24] rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <img 
                src="/images/keranjang.png" 
                alt="Add to Cart" 
                className="w-7 h-7 object-contain"
                /* Filter CSS untuk memastikan ikon keranjang berwarna kuning emas (#FBBF24) */
        
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
}