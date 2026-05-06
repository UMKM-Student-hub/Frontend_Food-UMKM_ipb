import React, { Component } from 'react';

export class FeatureBanner extends Component {
  render() {
    return (
      <div className="w-full px-6 lg:px-8 -mt-8 relative z-20">
        <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-6 md:py-8 px-6 flex flex-col md:flex-row items-center justify-between md:divide-x-2 divide-gray-100 gap-6 md:gap-0 border border-gray-50">
          
          {/* Fitur 1: Diskon Harian */}
          <div className="flex items-center justify-center gap-4 w-full md:w-1/3">
            <img 
              src="/images/icon-discount.png" 
              alt="Diskon Harian" 
              className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-sm" 
            />
            <div className="text-[#FF7A00] font-extrabold text-lg md:text-xl leading-tight">
              Diskon<br />Harian
            </div>
          </div>

          {/* Fitur 2: Traking Pesanan */}
          <div className="flex items-center justify-center gap-4 w-full md:w-1/3 pt-4 md:pt-0">
            <img 
              src="/images/icon-tracking.png" 
              alt="Traking Pesanan" 
              className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-sm" 
            />
            <div className="text-[#FF7A00] font-extrabold text-lg md:text-xl leading-tight">
              Traking<br />Pesanan
            </div>
          </div>

          {/* Fitur 3: Tanpa Antrean */}
          <div className="flex items-center justify-center gap-4 w-full md:w-1/3 pt-4 md:pt-0">
            <img 
              src="/images/icon-clock.png" 
              alt="Tanpa Antrean" 
              className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-sm" 
            />
            <div className="text-[#FF7A00] font-extrabold text-lg md:text-xl leading-tight">
              Tanpa<br />Antrean
            </div>
          </div>

        </div>
      </div>
    );
  }
}