import { Component } from "react";

interface StatSummaryCardProps {
  totalRevenue: number | string | null;
  totalTransactions: number | string | null;
}

export class StatSummaryCard extends Component<StatSummaryCardProps> {
  private formatNumber = (value: any): string => {
    const num = Number(value) || 0;
    return new Intl.NumberFormat("id-ID").format(num);
  };

  render() {
    const { totalRevenue, totalTransactions } = this.props;

    return (
      <div className="bg-[#FFD13B] rounded-4xl w-full py-16 px-8 flex flex-col md:flex-row justify-around items-center gap-12 shadow-sm mb-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-black mb-6">
            Total Penjualan (Rp)
          </h2>
          <p className="text-5xl md:text-6xl font-bold text-black tracking-tight">
            {this.formatNumber(totalRevenue)}
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-black mb-6">
            Total Transaksi
          </h2>
          <p className="text-5xl md:text-6xl font-bold text-black tracking-tight">
            {this.formatNumber(totalTransactions)}
          </p>
        </div>
      </div>
    );
  }
}
