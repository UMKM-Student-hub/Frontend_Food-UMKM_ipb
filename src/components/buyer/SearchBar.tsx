import { Component } from "react";
import type { ChangeEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (keyword: string) => void;
  className?: string;
}

export class SearchBar extends Component<SearchBarProps> {
  private handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.props.onChange(e.target.value);
  };

  private handleClearSearch = (): void => {
    this.props.onChange("");
  };

  render() {
    const { value, className = "" } = this.props;

    return (
      <div
        className={`flex items-center w-full bg-white border-[3px] border-[#1B2B65] rounded-2xl px-5 py-3.5 md:py-4 transition-all focus-within:shadow-xl focus-within:-translate-y-0.5 hover:shadow-md ${className}`}
      >
        <svg
          className="w-6 h-6 text-[#1B2B65]/50 mr-3 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={value}
          onChange={this.handleInputChange}
          placeholder="Cari menu atau nama kantin favoritmu di sini..."
          aria-label="Kolom pencarian menu dan kantin"
          className="grow bg-transparent border-none outline-none text-[#1B2B65] text-sm md:text-base font-bold placeholder-gray-400 w-full"
        />

        {value.length > 0 && (
          <button
            onClick={this.handleClearSearch}
            aria-label="Hapus pencarian"
            className="ml-2 bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-full p-1 transition-colors focus:outline-none"
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
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
}
