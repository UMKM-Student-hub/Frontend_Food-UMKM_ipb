import React, { Component } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'; // Mendukung 3 ukuran sesuai spesifikasi F.2
}

export class LoadingSpinner extends Component<LoadingSpinnerProps> {
  render() {
    const { size = 'md' } = this.props;
    
    // Menentukan ukuran spinner berdasarkan props
    let sizeClass = 'h-8 w-8'; // default (md)
    if (size === 'sm') sizeClass = 'h-5 w-5';
    if (size === 'lg') sizeClass = 'h-12 w-12';

    return (
      <div className="flex justify-center items-center w-full py-4">
        <div 
          className={`animate-spin rounded-full border-4 border-gray-200 border-t-[#fca311] ${sizeClass}`}
          role="status"
          aria-label="Loading..."
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
}