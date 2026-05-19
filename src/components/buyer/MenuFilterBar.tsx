import { Component } from "react";
import type { ChangeEvent } from "react";
import { ProductCategory } from "../../domain/enums";

interface MenuFilterBarProps {
  activeCategory: ProductCategory | "SEMUA";
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  onCategoryChange: (category: ProductCategory | "SEMUA") => void;
}

interface MenuFilterBarState {
  localKeyword: string;
}

export class MenuFilterBar extends Component<
  MenuFilterBarProps,
  MenuFilterBarState
> {
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(props: MenuFilterBarProps) {
    super(props);
    this.state = {
      localKeyword: props.searchKeyword,
    };
  }

  componentDidUpdate(prevProps: MenuFilterBarProps) {
    if (
      prevProps.searchKeyword !== this.props.searchKeyword &&
      this.props.searchKeyword !== this.state.localKeyword
    ) {
      this.setState({ localKeyword: this.props.searchKeyword });
    }
  }

  componentWillUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  private handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    this.setState({ localKeyword: value });

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.props.onSearchChange(value);
    }, 300);
  };

  private handleClearSearch = (): void => {
    this.setState({ localKeyword: "" });
    this.props.onSearchChange("");
  };

  private handleCategoryClick = (category: ProductCategory | "SEMUA"): void => {
    if (this.props.activeCategory !== category) {
      this.props.onCategoryChange(category);
    }
  };

  render() {
    const { activeCategory } = this.props;
    const { localKeyword } = this.state;

    const categories: Array<{ id: ProductCategory | "SEMUA"; label: string }> =
      [
        { id: "SEMUA", label: "Semua" },
        { id: ProductCategory.MAKANAN, label: "Makanan" },
        { id: ProductCategory.MINUMAN, label: "Minuman" },
        { id: ProductCategory.JAJANAN, label: "Jajanan" },
      ];

    return (
      <div className="flex flex-col w-full py-2 gap-4 bg-transparent">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1B2B65]/50">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={localKeyword}
            onChange={this.handleInputChange}
            placeholder="Cari menu lezat di kantin ini..."
            className="w-full pl-11 pr-10 py-3.5 bg-white border-2 border-gray-100 focus:border-[#FFB20E] rounded-2xl text-[#1B2B65] font-bold text-sm md:text-base placeholder-gray-400 focus:outline-none transition-all shadow-sm focus:shadow-md"
          />

          {localKeyword.length > 0 && (
            <button
              onClick={this.handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
            >
              <svg
                className="w-5 h-5 bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-full p-0.5 transition-colors"
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

        <div
          className="flex items-center gap-2.5 overflow-x-auto pb-1 scroll-smooth w-full hide-scrollbar"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => this.handleCategoryClick(cat.id)}
                className={`
                  whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm md:text-base border-2 transition-all duration-300 active:scale-95 focus:outline-none shrink-0
                  ${
                    isActive
                      ? "bg-[#FFB20E] border-[#FFB20E] text-[#1B2B65] shadow-md"
                      : "bg-white border-gray-200 text-gray-500 hover:border-[#FFB20E] hover:text-[#1B2B65]"
                  }
                `}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
