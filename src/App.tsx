import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pastikan path import ini mengarah ke lokasi file Navbar.tsx kamu
import { Navbar } from './components/common/NavbarPembeli'; 

export default class App extends Component {
  render() {
    return (
      <Router>
        {/* Wrapper utama dengan Tailwind: min-height layar penuh & flexbox */}
        <div className="min-h-screen bg-gray-50 flex flex-col">
          
          {/* Memanggil Navbar */}
          <Navbar />

          {/* Area Konten Utama */}
          <main className="flex-grow">
            <Routes>
              {/* Redirect path awal ('/') ke halaman catalog */}
              <Route path="/" element={<Navigate to="/catalog" replace />} />

              {/* Placeholder Halaman Sementara */}
              <Route 
                path="/catalog" 
                element={
                  <div className="flex justify-center items-center h-64 text-2xl font-semibold text-gray-700">
                    Halaman Home (Catalog)
                  </div>
                } 
              />
              
              <Route 
                path="/my-orders" 
                element={
                  <div className="flex justify-center items-center h-64 text-2xl font-semibold text-gray-700">
                    Halaman Pesanan Saya
                  </div>
                } 
              />

              <Route 
                path="/profile" 
                element={
                  <div className="flex justify-center items-center h-64 text-2xl font-semibold text-gray-700">
                    Halaman Profil Pengguna
                  </div>
                } 
              />
              
              {/* Tangkap URL yang tidak ada (404) */}
              <Route 
                path="*" 
                element={
                  <div className="flex justify-center items-center h-64 text-2xl font-semibold text-red-500">
                    404 - Halaman Tidak Ditemukan
                  </div>
                } 
              />
            </Routes>
          </main>
          
        </div>
      </Router>
    );
  }
}