import React, { Component } from 'react';

// Sesuaikan nama file dan path dengan yang ada di foldermu
import mascotHero from '/images/logo-hero-home.png'; 

export class Hero extends Component {
  render() {
    return (
      // Background kuning cerah. Kamu bisa sesuaikan kode hex-nya jika punya panduan warna spesifik
      <section className="bg-[#FFD027] w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between pt-12 md:pt-0 md:h-[450px]">
          
          {/* Bagian Kiri: Teks Copywriting */}
          <div className="md:w-3/5 flex flex-col justify-center text-center md:text-left z-10 pb-10 md:pb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1B2B65] leading-tight mb-4 tracking-wide">
              Makan Enak, Bebas Antre
            </h1>
            <p className="text-gray-900 text-lg md:text-xl leading-relaxed max-w-xl mx-auto md:mx-0 font-medium">
              Platform pre-order makanan khusus mahasiswa IPB. Cari menu, pantau pesananmu, dan nikmati waktu istirahat yang lebih santai
            </p>
          </div>

          {/* Bagian Kanan: Gambar Maskot */}
          <div className="md:w-2/5 flex justify-center md:justify-end items-end h-full relative">
            <img 
              src={mascotHero} 
              alt="Maskot UniBites IPB" 
              className="w-72 md:w-80 lg:w-[450px] object-contain drop-shadow-2xl"
              // Efek drop-shadow untuk membuat maskot lebih 'pop-out' dari background
            />
          </div>
          
        </div>
      </section>
    );
  }
}