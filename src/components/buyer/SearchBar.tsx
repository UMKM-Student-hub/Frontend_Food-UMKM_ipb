import React, { Component } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (keyword: string) => void;
  // Tambahkan props className agar parent bisa mengatur lebar & posisi
  className?: string; 
}

export class SearchBar extends Component<SearchBarProps> {
  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.props.onChange(event.target.value);
  };

  render() {
    const { value, className = "" } = this.props;

    return (
      // Menghilangkan max-w dan mx-auto di sini, menyerahkan urusan lebar ke Parent
      <div className={`flex items-center w-full bg-[#F8F9FA] border-2 border-[#1B2B65] rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 transition-all focus-within:shadow-md hover:shadow-sm ${className}`}>
        
        {/* Ikon Pencarian */}
        <img 
          src="/images/search.png" 
          alt="Search Icon" 
          className="w-5 h-5 md:w-6 md:h-6 object-contain mr-3 opacity-50"
        />
        
        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={this.handleInputChange}
          placeholder="Cari menu atau nama kantin favoritmu di sini.."
          className="flex-grow bg-transparent border-none outline-none text-[#1B2B65] text-sm md:text-base placeholder-[#8A92A6] font-medium w-full"
        />
        
      </div>
    );
  }
}