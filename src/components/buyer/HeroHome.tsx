import { Component } from "react";

export class HeroHome extends Component {
  render() {
    return (
      <section className="bg-[#FFCF00] w-full overflow-hidden mt-0 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between pt-12 md:pt-0 min-h-100 md:h-112.5">
          <div className="w-full md:w-3/5 flex flex-col justify-center text-center md:text-left z-10 pb-12 md:pb-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1B2B65] leading-tight mb-5 tracking-tight">
              Makan Enak,
              <br />
              Bebas Antre
            </h1>
            <p className="text-[#1B2B65]/80 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto md:mx-0 font-medium">
              Platform order makanan khusus mahasiswa IPB. Cari menu, pantau
              pesananmu, dan nikmati waktu istirahat yang lebih santai.
            </p>
          </div>

          <div className="w-full md:w-2/5 flex justify-center md:justify-end items-end h-full relative mt-auto">
            <img
              src="/images/logo-hero-home.png"
              alt="Maskot UniBites IPB"
              className="w-64 sm:w-72 md:w-80 lg:w-112.5 object-contain drop-shadow-2xl translate-y-4 md:translate-y-8"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      </section>
    );
  }
}
