import { Component } from "react";
import { ProductCategory } from "../../domain/enums";

interface CategoryFilterProps {
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
}

export class CategoryFilter extends Component<CategoryFilterProps> {
  // Mapping label tampilan ke nilai enum atau undefined untuk "Semua"
  private categories = [
    { label: "Semua", value: undefined },
    { label: "Makanan", value: ProductCategory.MAKANAN },
    { label: "Minuman", value: ProductCategory.MINUMAN },
    { label: "Jajanan", value: ProductCategory.JAJANAN },
  ];

  render() {
    const { selectedCategory, onCategoryChange } = this.props;

    return (
      /* PERBAIKAN: Menghapus mx-auto dan px-4 agar container menempel ke kiri */
      <div className="w-full max-w-4xl">
        {/* PERBAIKAN: Mengubah justify-center menjadi justify-start */}
        <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4">
          {this.categories.map((cat) => {
            const isActive = selectedCategory === cat.value; 
            
            return (
              <button
                key={cat.label}
                onClick={() => onCategoryChange(cat.value)}
                className={`
                  px-6 py-2.5 rounded-full border-2 text-sm sm:text-base font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#FBBF24] border-[#FBBF24] text-[#1E3A8A]" 
                      : "bg-white border-[#FBBF24] text-[#1E3A8A] hover:bg-[#FBBF24]/10"
                  }
                  focus:outline-none shadow-sm cursor-pointer
                `}
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