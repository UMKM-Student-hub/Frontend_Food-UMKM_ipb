import { Component } from "react";

export type TabType = "masuk" | "proses" | "selesai" | "batal";

interface OrderTabsProps {
  activeTab: TabType;
  counts: {
    masuk: number;
    proses: number;
  };
  onTabChange: (tab: TabType) => void;
}

export class OrderTabs extends Component<OrderTabsProps> {
  private renderTabItem = (
    id: TabType,
    label: string,
    hasNotification: boolean,
  ) => {
    const { activeTab, onTabChange } = this.props;
    const isActive = activeTab === id;

    return (
      <button
        onClick={() => onTabChange(id)}
        className={`relative px-6 py-4 text-base transition-colors flex items-center gap-2 ${
          isActive
            ? "font-bold text-gray-900 border-b-4 border-red-500"
            : "font-normal text-gray-600 hover:text-gray-900 border-b-4 border-transparent hover:border-gray-200"
        }`}
      >
        {label}
        {hasNotification && (
          <span className="w-3 h-3 bg-red-500 rounded-full inline-block animate-pulse shadow-sm"></span>
        )}
      </button>
    );
  };

  render() {
    const { counts } = this.props;

    return (
      <div className="w-full bg-white border-b border-gray-200 mb-8 overflow-x-auto">
        <div className="flex min-w-max px-4">
          {this.renderTabItem("masuk", "Pesanan Masuk", counts.masuk > 0)}
          {this.renderTabItem("proses", "Dalam Proses", counts.proses > 0)}

          {this.renderTabItem("selesai", "Selesai", false)}
          {this.renderTabItem("batal", "Batal", false)}
        </div>
      </div>
    );
  }
}
