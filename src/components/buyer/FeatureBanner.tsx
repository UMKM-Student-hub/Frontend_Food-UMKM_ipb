import { Component } from "react";

export class FeatureBanner extends Component {
  render() {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-16 -mt-8 relative z-20">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-8 px-6 flex flex-col md:flex-row items-center justify-between divide-y-2 md:divide-y-0 md:divide-x-2 divide-gray-100 border border-gray-50">
          <div className="flex items-center justify-center md:justify-start gap-5 w-full md:w-1/3 py-5 md:py-0 md:px-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FF7A00]/10 rounded-2xl flex items-center justify-center text-[#FF7A00] shrink-0">
              <svg
                className="w-8 h-8 md:w-9 md:h-9"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="text-[#FF7A00] font-black text-lg md:text-xl leading-tight tracking-wide">
              Diskon
              <br />
              Harian
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-center gap-5 w-full md:w-1/3 py-5 md:py-0 md:px-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FF7A00]/10 rounded-2xl flex items-center justify-center text-[#FF7A00] shrink-0">
              <svg
                className="w-8 h-8 md:w-9 md:h-9"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <div className="text-[#FF7A00] font-black text-lg md:text-xl leading-tight tracking-wide">
              Traking
              <br />
              Pesanan
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-5 w-full md:w-1/3 py-5 md:py-0 md:px-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FF7A00]/10 rounded-2xl flex items-center justify-center text-[#FF7A00] shrink-0">
              <svg
                className="w-8 h-8 md:w-9 md:h-9"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-[#FF7A00] font-black text-lg md:text-xl leading-tight tracking-wide">
              Tanpa
              <br />
              Antrean
            </div>
          </div>
        </div>
      </div>
    );
  }
}
