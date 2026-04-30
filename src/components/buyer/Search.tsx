import React, { Component } from 'react';

// Asumsi gambar ikon pencariannya kamu simpan dengan nama 'icon-search.png' 
// Sesuaikan path import ini dengan struktur folder aslimu
import iconSearch from 'images/search.png';

interface SearchBarProps {
  value: string;
  onChange: (keyword: string) => void;
}

export class SearchBar extends Component<SearchBarProps> {
  
  // Method untuk menangani perubahan input dari user
  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // Memanggil fungsi onChange yang dikirim dari parent component (misal: CatalogPage)
    this.props.onChange(event.target.value);
  };

  render() {
    const { value } = this.props;

    return (
      <div className="w-full max-w-4xl mx-auto my-6">
        {/* Container Search Bar */}
        <div className="flex items-center w-full bg-[#F5F6F8] border-2 border-[#1B2B65] rounded-2xl px-5 py-3 transition-shadow focus-within:shadow-md">
          
          {/* Ikon Pencarian */}
          <img 
            src={iconSearch} 
            alt="Search Icon" 
            className="w-6 h-6 object-contain mr-3 opacity-60"
          />
          
          {/* Input Field */}
          <input
            type="text"
            value={value}
            onChange={this.handleInputChange}
            placeholder="Cari menu atau nama kantin favoritmu di sini.."
            className="flex-grow bg-transparent border-none outline-none text-[#1B2B65] text-base placeholder-[#8A92A6] font-medium"
          />
          
        </div>
      </div>
    );
  }
}