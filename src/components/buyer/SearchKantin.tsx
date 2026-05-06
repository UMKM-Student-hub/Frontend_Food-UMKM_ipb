import React, { Component } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (keyword: string) => void;
}

export class SearchBar extends Component<SearchBarProps> {
  
  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.props.onChange(event.target.value);
  };

  render() {
    const { value } = this.props;

    return (
      <div className="w-full max-w-4xl mx-auto my-6">
        <div className="flex items-center w-full bg-[#F5F6F8] border-2 border-[#1E3A8A] rounded-2xl px-5 py-3 transition-shadow focus-within:shadow-md">
          
          {/* PERBAIKAN: Langsung panggil path dari folder public */}
          <img 
            src="/images/search.png" 
            alt="Search Icon" 
            className="w-6 h-6 object-contain mr-3 opacity-60"
          />
          
          <input
            type="text"
            value={value}
            onChange={this.handleInputChange}
            placeholder="Cari menu atau nama kantin favoritmu di sini.."
            className="flex-grow bg-transparent border-none outline-none text-[#1E3A8A] text-base placeholder-[#8A92A6] font-medium"
          />
          
        </div>
      </div>
    );
  }
}