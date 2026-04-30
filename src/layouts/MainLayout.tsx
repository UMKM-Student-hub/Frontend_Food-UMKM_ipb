import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/NavbarPembeli";
import { Footer } from "../components/common/Footer";

class MainLayout extends Component {
  render() {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <Navbar />

        <main className="grow flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grow">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    );
  }
}

export default MainLayout;
