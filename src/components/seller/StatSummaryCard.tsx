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
      <div className="bg-[#FFD13B] rounded-3xl md:rounded-[2.5rem] w-full py-8 md:py-12 px-6 md:px-10 flex flex-col sm:flex-row justify-around items-center gap-8 md:gap-12 shadow-sm mb-8 md:mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col items-center text-center relative z-10 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-[#E5BC35] pb-8 sm:pb-0">
          <h2 className="text-sm md:text-lg font-extrabold text-[#1B2B65]/70 uppercase tracking-widest mb-2 md:mb-3">
            Total Penjualan (Rp)
          </h2>
          <p className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1B2B65] tracking-tight">
            {this.formatNumber(totalRevenue)}
          </p>
        </div>

        <div className="flex flex-col items-center text-center relative z-10 w-full sm:w-1/2">
          <h2 className="text-sm md:text-lg font-extrabold text-[#1B2B65]/70 uppercase tracking-widest mb-2 md:mb-3">
            Total Transaksi
          </h2>
          <p className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1B2B65] tracking-tight">
            {this.formatNumber(totalTransactions)}
          </p>
        </div>
      </div>
    );
  }
}
