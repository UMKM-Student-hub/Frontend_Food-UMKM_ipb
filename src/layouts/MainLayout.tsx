import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

class MainLayout extends Component {
  render() {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <Navbar />

        {/* ✅ Hapus wrapper div dengan padding — tiap page atur layout sendiri */}
        <main className="grow flex flex-col">
          <Outlet />
        </main>

        <Footer />
      </div>
    );
  }
}

export default MainLayout;