import React from "react";

interface FooterProps {}
interface FooterState {}

export class Footer extends React.Component<FooterProps, FooterState> {
  render() {
    return (
      <footer className="relative w-full bg-[#FFD13B] text-[#02145A] font-sans py-8 px-6 lg:px-16 overflow-hidden">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          <div className="flex-shrink-0 z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-[#02145A] rounded-full flex items-center justify-center overflow-hidden shadow-lg border-4 border-[#02145A]">
              <img
                src="/images/logo-footer.png"
                alt="UniBites Mascot"
                className="w-[85%] h-auto object-contain translate-y-2"
              />
            </div>
          </div>

          <div className="order-last md:order-none md:absolute md:bottom-6 md:left-1/2 md:-translate-x-1/2 z-10 text-center w-full md:w-auto mt-4 md:mt-0">
            <p className="text-sm md:text-base font-medium tracking-wide">
              © 2026 All Rights Reserved
            </p>
          </div>

          <div className="flex flex-col items-center flex-shrink-0 z-10">
            <img
              src="/images/logo-ipb.png"
              alt="IPB University Logo"
              className="h-12 md:h-16 w-auto mb-2 object-contain"
            />
            <h3 className="text-lg md:text-xl font-semibold tracking-wide mt-1">
              Ilmu Komputer
            </h3>
          </div>
        </div>
      </footer>
    );
  }
}
