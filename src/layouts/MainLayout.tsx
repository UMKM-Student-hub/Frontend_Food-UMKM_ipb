import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar.tsx";

class MainLayout extends Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    );
  }
}

export default MainLayout;
