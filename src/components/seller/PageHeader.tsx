import { Component } from "react";

interface PageHeaderProps {
  title: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export class PageHeader extends Component<PageHeaderProps> {
  render() {
    const { title, buttonLabel, onButtonClick } = this.props;

    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1B2B65] tracking-tight">
          {title}
        </h1>

        {buttonLabel && onButtonClick && (
          <button
            onClick={onButtonClick}
            className="bg-[#FFD13B] text-[#1B2B65] px-8 py-3 rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-yellow-400 transition-all active:scale-95 w-full sm:w-auto text-center"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    );
  }
}
