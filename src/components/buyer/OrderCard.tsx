import React, { type ChangeEvent } from 'react';
import { type Order } from '../../domain/Order';
import { OrderStatus } from '../../domain/enums';
import { ReviewService } from '../../services/ReviewService';

interface OrderCardProps {
  order: Order;
  umkmName: string; // Didapat dari parent (CatalogService)
  imageUrl: string; // Didapat dari parent (berdasarkan menu_item_id)
  initialHasReviewed?: boolean; // Untuk mengecek apakah order ini sudah pernah diulas sebelumnya
}

interface OrderCardState {
  rating: number;
  hoverRating: number;
  comment: string;
  isSubmitting: boolean;
  isReviewed: boolean;
  error: string | null;
}

export class OrderCard extends React.Component<OrderCardProps, OrderCardState> {
  private reviewService: ReviewService;

  constructor(props: OrderCardProps) {
    super(props);
    this.reviewService = new ReviewService();
    this.state = {
      rating: 0,
      hoverRating: 0,
      comment: '',
      isSubmitting: false,
      isReviewed: props.initialHasReviewed || false,
      error: null,
    };
  }

  // --- Utility Formatters ---
  private formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  // --- Handlers untuk Form Review ---
  private handleStarClick = (rating: number): void => {
    this.setState({ rating, error: null });
  };

  private handleStarHover = (hoverRating: number): void => {
    this.setState({ hoverRating });
  };

  private handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ comment: e.target.value });
  };

  private handleSubmitReview = async (): Promise<void> => {
    const { rating, comment } = this.state;
    const { order } = this.props;

    if (rating === 0) {
      this.setState({ error: 'Mohon berikan rating bintang terlebih dahulu.' });
      return;
    }

    this.setState({ isSubmitting: true, error: null });

    try {
      await this.reviewService.submitReview({
        order_id: order.id,
        rating,
        comment,
      });
      // Jika sukses, ubah state UI agar form hilang dan hanya tampil badge "Selesai"
      this.setState({ isReviewed: true });
    } catch (err: any) {
      this.setState({ error: err.message || 'Gagal mengirim ulasan.' });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  // --- Render Helpers ---
  private renderStatusBadge(status: OrderStatus) {
    let bgColor = 'bg-gray-500';
    let label: string = status; // <--- Tambahkan ": string" di sini

    switch (status) {
      case OrderStatus.PENDING:
        bgColor = 'bg-yellow-500';
        label = 'Menunggu Konfirmasi';
        break;
      case OrderStatus.CONFIRMED:
      case OrderStatus.PROCESSING:
        bgColor = 'bg-[#0c2368]'; // Biru Dongker dari mockup
        label = 'Dalam Proses';
        break;
      case OrderStatus.READY:
        bgColor = 'bg-blue-500';
        label = 'Siap Diambil';
        break;
      case OrderStatus.DONE:
        bgColor = 'bg-[#39B54A]'; // Hijau dari mockup
        label = 'Selesai';
        break;
      case OrderStatus.CANCELLED:
        bgColor = 'bg-red-600';
        label = 'Dibatalkan';
        break;
    }

    return (
      <div className={`${bgColor} text-white font-semibold px-6 py-2 rounded-full text-sm shadow-sm whitespace-nowrap`}>
        {label}
      </div>
    );
  }

  private renderReviewForm() {
    const { rating, hoverRating, comment, isSubmitting, error } = this.state;

    return (
      <div className="flex flex-col w-full md:w-3/5 md:pl-8 mt-6 md:mt-0">
        <h4 className="text-[#0c2368] font-bold mb-2">Gimana Rasanya?</h4>
        
        {/* Star Rating Area */}
        <div className="flex gap-2 mb-4" onMouseLeave={() => this.handleStarHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoverRating || rating);
            return (
              <button
                key={star}
                type="button"
                onClick={() => this.handleStarClick(star)}
                onMouseEnter={() => this.handleStarHover(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isFilled ? '#FFB300' : 'none'}
                  stroke="#FFB300"
                  strokeWidth="2"
                  className="w-10 h-10"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Komentar (Warna Kuning/Orange sesuai Mockup) */}
        <textarea
          rows={3}
          value={comment}
          onChange={this.handleCommentChange}
          disabled={isSubmitting}
          placeholder="Tuliskan pengalaman kamu, apa yang perlu ditingkatkan?"
          className="w-full bg-[#FFB300] text-white placeholder-white/90 rounded-2xl p-4 focus:outline-none resize-none disabled:opacity-70 shadow-inner"
        />

        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

        {/* Tombol Kirim */}
        <div className="flex justify-end mt-4">
          <button
            onClick={this.handleSubmitReview}
            disabled={isSubmitting}
            className="bg-[#0c2368] hover:bg-[#0a1b52] text-white font-semibold px-6 py-2 rounded-xl transition-colors disabled:bg-gray-400 shadow-md"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { order, umkmName, imageUrl } = this.props;
    const { isReviewed } = this.state;
    
    // Ambil item pertama dari array order items untuk ditampilkan representasinya
    const firstItem = order.items[0];
    const isMultipleItems = order.items.length > 1;
    const displayMenuName = isMultipleItems 
      ? `${firstItem?.menu_name} (+${order.items.length - 1} lainnya)`
      : firstItem?.menu_name || 'Item tidak diketahui';

    // Logika Kapan Menampilkan Form Review
    // Muncul JIKA status DONE DAN belum pernah di-review
    const showReviewForm = order.status === OrderStatus.DONE && !isReviewed;

    return (
      <div className="w-full bg-[#F8F9FA] border border-gray-200 rounded-3xl p-6 md:p-8 flex flex-col relative shadow-sm hover:shadow-md transition-shadow">
        
        {/* Tanggal Pojok Kanan Atas */}
        <div className="absolute top-6 right-6 md:right-8 text-sm text-gray-500 font-medium">
          {this.formatDate(order.created_at)}
        </div>

        <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center">
          
          {/* Sisi Kiri: Info UMKM & Makanan */}
          <div className="flex flex-col flex-1">
            <h3 className="text-[#0c2368] text-xl font-extrabold mb-4">{umkmName}</h3>
            
            <div className="flex flex-row items-center gap-6">
              <img
                src={imageUrl || '/images/default-food.png'}
                alt={displayMenuName}
                className="w-24 h-24 object-cover rounded-2xl shadow-sm border border-gray-100"
              />
              <div className="flex flex-col justify-center text-gray-800">
                <p className="font-semibold text-lg">{displayMenuName}</p>
                <p className="text-gray-600 font-medium mt-1">{this.formatRupiah(order.total_price)}</p>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Form Review ATAU Badge Status */}
          {showReviewForm ? (
            <>
              {/* Render Form Review di tengah */}
              {this.renderReviewForm()}
              {/* Tetap tampilkan Badge Selesai di ujung kanan sesuai mockup */}
              <div className="hidden md:block ml-6 self-center">
                {this.renderStatusBadge(order.status)}
              </div>
            </>
          ) : (
            <div className="mt-6 md:mt-0 md:ml-auto">
              {this.renderStatusBadge(order.status)}
            </div>
          )}

        </div>
      </div>
    );
  }
}