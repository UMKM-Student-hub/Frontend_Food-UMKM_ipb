import React from 'react';
import { OrderService } from '../../services/OrderService';
import { CatalogService } from '../../services/CatalogService';
import { OrderCard } from '../../components/buyer/OrderCard';
import { type Order } from '../../domain/Order';
import { type UMKM } from '../../domain/UMKM';

interface MyOrdersState {
  orders: Order[];
  umkmMap: Record<number, string>; // Map id UMKM ke Nama UMKM
  productImageMap: Record<number, string>; // Map id Menu ke URL Foto
  isLoading: boolean;
  error: string | null;
}

export class MyOrdersPage extends React.Component<{}, MyOrdersState> {
  private orderService: OrderService;
  private catalogService: CatalogService;

  constructor(props: {}) {
    super(props);
    this.orderService = new OrderService();
    this.catalogService = new CatalogService();
    this.state = {
      orders: [],
      umkmMap: {},
      productImageMap: {},
      isLoading: true,
      error: null,
    };
  }

  async componentDidMount() {
    await this.fetchData();
  }

  private async fetchData(): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      // 1. Ambil semua pesanan user
      const orders = await this.orderService.getMyOrders();

      // 2. Ambil semua UMKM untuk mendapatkan nama toko
      const umkms = await this.catalogService.listAllUMKM();
      const umkmMap: Record<number, string> = {};
      umkms.forEach((u: UMKM) => {
        umkmMap[u.id] = u.name;
      });

      // 3. Ambil data produk unik untuk mendapatkan foto
      const productImageMap: Record<number, string> = {};
      const uniqueProductIds = Array.from(
        new Set(orders.flatMap(o => o.items.map(i => i.menu_item_id)))
      );

      // Fetch detail produk secara paralel untuk efisiensi
      await Promise.all(
        uniqueProductIds.map(async (id) => {
          try {
            const product = await this.catalogService.getProductDetail(id);
            if (product.photo_url) {
              productImageMap[id] = product.photo_url;
            }
          } catch {
            // Jika gagal, biarkan kosong agar memakai default image di OrderCard
          }
        })
      );

      this.setState({ orders, umkmMap, productImageMap });
    } catch (err: any) {
      this.setState({ error: err.message || 'Gagal memuat riwayat pesanan.' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { orders, umkmMap, productImageMap, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c2368]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-8 rounded-3xl text-center border border-red-200">
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button 
            onClick={() => this.fetchData()}
            className="bg-[#0c2368] text-white px-6 py-2 rounded-xl"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0c2368]">Pesanan Saya</h1>
          <p className="text-gray-600">Pantau status kulineranmu di sini.</p>
        </header>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">Belum ada pesanan nih. Yuk cari makanan!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                umkmName={umkmMap[order.umkm_id] || 'UMKM Tidak Diketahui'}
                imageUrl={productImageMap[order.items[0]?.menu_item_id] || ''}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}