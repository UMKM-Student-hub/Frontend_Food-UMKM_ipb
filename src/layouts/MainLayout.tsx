import { Component, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

const PageLoader = () => (
  <div className="flex flex-col justify-center items-center h-[70vh] w-full bg-[#FFFCF5]">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-[#1B2B65] font-bold animate-pulse tracking-wide">
      Memuat halaman...
    </p>
  </div>
);

class MainLayout extends Component {
  render() {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFCF5] font-sans">
        <Navbar />
        <main className="grow flex flex-col relative w-full">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    );
  }
}

export default MainLayout;
