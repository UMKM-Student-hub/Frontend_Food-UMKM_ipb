import { Component } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Order } from "../../domain/Order";
import { OrderStatus } from "../../domain/enums";
import { ReviewService } from "../../services/ReviewService";

interface ItemReviewState {
  rating: number;
  hoverRating: number;
  comment: string;
  isSubmitting: boolean;
  isReviewed: boolean;
  error: string | null;
}

interface OrderCardProps {
  order: Order;
  umkmName: string;
  imageUrlMap: Record<number, string>;
  initialReviewedMenuIds?: number[];
  onMarkDone?: (orderId: number) => void;
}

interface OrderCardState {
  itemReviews: Record<number, ItemReviewState>;
}

export class OrderCard extends Component<OrderCardProps, OrderCardState> {
  private reviewService = new ReviewService();

  constructor(props: OrderCardProps) {
    super(props);

    const itemReviews: Record<number, ItemReviewState> = {};
    const reviewedIds = props.initialReviewedMenuIds || [];

    if (props.order.items) {
      props.order.items.forEach((item) => {
        itemReviews[item.menu_item_id] = {
          rating: 0,
          hoverRating: 0,
          comment: "",
          isSubmitting: false,
          isReviewed: reviewedIds.includes(item.menu_item_id),
          error: null,
        };
      });
    }

    this.state = { itemReviews };
  }

  private formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "Rp ");
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  private getFullImageUrl(path: string): string | null {
    if (!path) return null;
    return path.startsWith("/") ? `http://localhost:8000${path}` : path;
  }

  private handleStarClick = (menuItemId: number, value: number) => {
    const current = this.state.itemReviews[menuItemId];
    if (!current || current.isSubmitting || current.isReviewed) return;

    this.setState((prev) => ({
      itemReviews: {
        ...prev.itemReviews,
        [menuItemId]: {
          ...prev.itemReviews[menuItemId],
          rating: value,
          error: null,
        },
      },
    }));
  };

  private handleStarHover = (menuItemId: number, value: number) => {
    const current = this.state.itemReviews[menuItemId];
    if (!current || current.isSubmitting || current.isReviewed) return;

    this.setState((prev) => ({
      itemReviews: {
        ...prev.itemReviews,
        [menuItemId]: { ...prev.itemReviews[menuItemId], hoverRating: value },
      },
    }));
  };

  private handleStarLeave = (menuItemId: number) => {
    const current = this.state.itemReviews[menuItemId];
    if (!current || current.isSubmitting || current.isReviewed) return;

    this.setState((prev) => ({
      itemReviews: {
        ...prev.itemReviews,
        [menuItemId]: { ...prev.itemReviews[menuItemId], hoverRating: 0 },
      },
    }));
  };

  private handleCommentChange = (
    menuItemId: number,
    e: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    this.setState((prev) => ({
      itemReviews: {
        ...prev.itemReviews,
        [menuItemId]: {
          ...prev.itemReviews[menuItemId],
          comment: value,
          error: null,
        },
      },
    }));
  };

  private handleSubmitReview = async (menuItemId: number, e: FormEvent) => {
    e.preventDefault();
    const current = this.state.itemReviews[menuItemId];
    if (!current || current.rating === 0) {
      this.setState((prev) => ({
        itemReviews: {
          ...prev.itemReviews,
          [menuItemId]: {
            ...prev.itemReviews[menuItemId],
            error: "Pilih bintang penilaian terlebih dahulu.",
          },
        },
      }));
      return;
    }

    this.setState((prev) => ({
      itemReviews: {
        ...prev.itemReviews,
        [menuItemId]: {
          ...prev.itemReviews[menuItemId],
          isSubmitting: true,
          error: null,
        },
      },
    }));

    try {
      await this.reviewService.submitReview({
        order_id: this.props.order.id,
        menu_item_id: menuItemId,
        rating: current.rating,
        comment: current.comment.trim() || undefined,
      });

      this.setState((prev) => ({
        itemReviews: {
          ...prev.itemReviews,
          [menuItemId]: {
            ...prev.itemReviews[menuItemId],
            isReviewed: true,
            isSubmitting: false,
          },
        },
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim ulasan.";
      this.setState((prev) => ({
        itemReviews: {
          ...prev.itemReviews,
          [menuItemId]: {
            ...prev.itemReviews[menuItemId],
            error: msg,
            isSubmitting: false,
          },
        },
      }));
    }
  };

  private renderStatusBadge(status: OrderStatus) {
    const statusConfig: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      [OrderStatus.PENDING]: {
        bg: "bg-gray-200",
        text: "text-gray-700",
        label: "Menunggu",
      },
      [OrderStatus.CONFIRMED]: {
        bg: "bg-[#1B2B65]",
        text: "text-white",
        label: "Dalam Proses",
      },
      [OrderStatus.PROCESSING]: {
        bg: "bg-[#1B2B65]",
        text: "text-white",
        label: "Dalam Proses",
      },
      [OrderStatus.READY]: {
        bg: "bg-blue-500",
        text: "text-white",
        label: "Siap Diambil",
      },
      [OrderStatus.DONE]: {
        bg: "bg-[#4CAF50]",
        text: "text-white",
        label: "Selesai",
      },
      [OrderStatus.CANCELLED]: {
        bg: "bg-[#F44336]",
        text: "text-white",
        label: "Dibatalkan",
      },
    };

    const config = statusConfig[status] || statusConfig[OrderStatus.PENDING];

    return (
      <span
        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-sm ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  }

  private renderReviewForm(menuItemId: number) {
    const current = this.state.itemReviews[menuItemId];
    if (!current || current.isReviewed) return null;

    return (
      <form
        onSubmit={(e) => this.handleSubmitReview(menuItemId, e)}
        className="flex flex-col mt-4 pt-4 border-t border-gray-100/50"
      >
        <span className="text-[#1B2B65] font-extrabold text-[15px] mb-2">
          Gimana Rasanya?
        </span>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => this.handleStarClick(menuItemId, star)}
              onMouseEnter={() => this.handleStarHover(menuItemId, star)}
              onMouseLeave={() => this.handleStarLeave(menuItemId)}
              className={`w-9 h-9 cursor-pointer transition-all duration-200 hover:scale-110 ${
                (current.hoverRating || current.rating) >= star
                  ? "text-[#FFB20E]"
                  : "text-transparent stroke-[#FFB20E] stroke-2"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          ))}
        </div>

        <textarea
          value={current.comment}
          onChange={(e) => this.handleCommentChange(menuItemId, e)}
          disabled={current.isSubmitting}
          placeholder="Tuliskan pengalaman kamu, apa yang perlu ditingkatkan?"
          className="w-full text-sm rounded-2xl px-5 py-4 bg-[#FFB20E] text-white placeholder-white/80 focus:outline-none resize-none shadow-sm"
          rows={3}
        />

        {current.error && (
          <span className="text-red-500 text-xs font-bold mt-2">
            {current.error}
          </span>
        )}

        <button
          type="submit"
          disabled={current.isSubmitting || current.rating === 0}
          className="bg-[#1B2B65] hover:bg-[#102A71] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold px-8 py-2.5 rounded-xl transition-all shadow-md mt-4 self-end"
        >
          {current.isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
        </button>
      </form>
    );
  }

  render() {
    const { order, umkmName, imageUrlMap, onMarkDone } = this.props;
    const showReviewSection = order.status === OrderStatus.DONE;

    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col mb-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-50 pb-4">
          <div>
            <h3 className="text-[#1B2B65] text-lg font-extrabold tracking-wide mb-1">
              {umkmName}
            </h3>
            <span className="text-sm font-medium text-gray-400">
              {this.formatDate(order.created_at)}
            </span>
          </div>

          <div className="self-end md:self-auto shrink-0 mt-2 md:mt-0">
            {order.status === OrderStatus.READY && onMarkDone ? (
              <button
                onClick={() => onMarkDone(order.id)}
                className="px-6 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-md bg-blue-500 hover:bg-blue-600 text-white transition-all active:scale-95 focus:outline-none"
              >
                Pesanan Diterima
              </button>
            ) : (
              this.renderStatusBadge(order.status)
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {order.items &&
            order.items.map((item) => {
              const itemImg = imageUrlMap ? imageUrlMap[item.menu_item_id] : "";
              const photoUrl = this.getFullImageUrl(itemImg || "");

              return (
                <div
                  key={item.id || item.menu_item_id}
                  className="flex flex-col"
                >
                  <div className="flex items-start md:items-center gap-5 w-full">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 shadow-sm relative">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={item.menu_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.outerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100"><span class="text-gray-300 text-xs font-bold">NO IMG</span></div>`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-300 text-xs font-bold">
                            NO IMG
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1">
                      <p className="font-bold text-[#1B2B65] text-lg leading-tight mb-1">
                        {item.menu_name}
                      </p>

                      {/* ELEMEN BARU UNTUK MERENDER CATATAN PESANAN */}
                      {item.notes && item.notes.trim() !== "" && (
                        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 w-fit mb-1.5">
                          <p className="text-gray-500 text-xs font-medium italic">
                            <span className="font-bold mr-1">Catatan:</span>
                            {item.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 font-medium text-sm">
                          Qty: {item.quantity}x
                        </span>
                        <span className="text-gray-300 text-sm">•</span>
                        <span className="text-gray-800 font-extrabold text-sm">
                          {this.formatRupiah(item.unit_price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {showReviewSection &&
                    this.renderReviewForm(item.menu_item_id)}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
