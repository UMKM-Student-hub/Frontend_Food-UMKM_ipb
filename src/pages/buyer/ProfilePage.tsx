import React, { Component } from 'react';
import { AuthService } from '../../services/AuthService';
import { OrderService } from '../../services/OrderService';
import type { User } from '../../domain/User';

// Sesuai aturan B.1: Definisi Interface untuk State
interface ProfilePageState {
  user: User | null;
  totalOrders: number;
  isLoading: boolean;
  error: string | null;
}

export default class ProfilePage extends Component<{}, ProfilePageState> {
  // Injeksi Service Layer sesuai aturan A.2
  private authService = new AuthService();
  private orderService = new OrderService();

  constructor(props: {}) {
    super(props);
    this.state = {
      user: null,
      totalOrders: 0,
      isLoading: true,
      error: null,
    };
  }

  // Lifecycle Method untuk fetch data
  async componentDidMount() {
    await this.fetchProfileData();
  }

  // Pola Wajib F.3: Error Handling Pattern (try-catch-finally)
  private async fetchProfileData(): Promise<void> {
    this.setState({ isLoading: true, error: null });
    
    try {
      // Fetch profil user dan pesanan secara paralel agar lebih cepat
      const [userData, myOrders] = await Promise.all([
        this.authService.getMe(),
        this.orderService.getMyOrders()
      ]);

      this.setState({ 
        user: userData, 
        totalOrders: myOrders.length // Hitung total pesanan langsung dari array
      });
    } catch (err: any) {
      this.setState({ error: err.message || 'Gagal memuat profil pengguna.' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Handler untuk tombol Edit Profil (bisa dikembangkan nanti)
  private handleEditProfile = (): void => {
    alert("Fitur edit profil akan segera hadir!");
  };

  render() {
    const { user, totalOrders, isLoading, error } = this.state;

    // Loading State
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[60vh] text-[#1B2B65] font-bold text-xl">
          Memuat Profil...
        </div>
      );
    }

    // Error State
    if (error) {
      return (
        <div className="max-w-4xl mx-auto mt-10 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button onClick={() => this.fetchProfileData()} className="mt-3 underline">Coba Lagi</button>
        </div>
      );
    }

    // Menghindari render jika user null (meskipun secara teori harusnya ada jika sudah login)
    if (!user) return null;

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        
        {/* --- KARTU PROFIL UTAMA --- */}
        <div className="rounded-[2rem] shadow-xl overflow-hidden flex flex-col">
          
          {/* 1. Header (Kuning) */}
          <div className="bg-[#FFB20E] px-6 md:px-10 py-6 md:py-8 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2B65] tracking-wide">
              Profil Saya
            </h1>
            <button 
              onClick={this.handleEditProfile}
              className="bg-[#1B2B65] hover:bg-[#102A71] text-white font-bold px-6 py-2.5 rounded-full transition-colors active:scale-95 shadow-md"
            >
              Edit Profil
            </button>
          </div>

          {/* 2. Body (Navy Blue) */}
          <div className="bg-[#102A71] px-6 md:px-10 py-10 flex flex-col-reverse md:flex-row gap-10 md:gap-16">
            
            {/* Bagian Kiri: Form Data Diri */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              
              {/* Field: Nama Lengkap */}
              <div>
                <label className="block text-white font-semibold text-lg md:text-xl mb-2">
                  Nama Lengkap
                </label>
                <input 
                  type="text" 
                  value={user.name} 
                  readOnly 
                  className="w-full bg-white rounded-xl px-4 py-3.5 text-gray-800 font-medium outline-none opacity-95 cursor-default"
                />
              </div>

              {/* Field: No Telpon */}
              <div>
                <label className="block text-white font-semibold text-lg md:text-xl mb-2">
                  No Telpon
                </label>
                <input 
                  type="text" 
                  value={user.phone} 
                  readOnly 
                  className="w-full bg-white rounded-xl px-4 py-3.5 text-gray-800 font-medium outline-none opacity-95 cursor-default"
                />
              </div>

              {/* Field: Alamat Email */}
              <div>
                <label className="block text-white font-semibold text-lg md:text-xl mb-2">
                  Alamat Email
                </label>
                <input 
                  type="email" 
                  value={user.email} 
                  readOnly 
                  className="w-full bg-white rounded-xl px-4 py-3.5 text-gray-800 font-medium outline-none opacity-95 cursor-default"
                />
              </div>

            </div>

            {/* Bagian Kanan: Aktivitas Pembeli Card */}
            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <h3 className="text-[#1B2B65] font-extrabold text-xl mb-6">
                  Aktivitas Pembeli
                </h3>
                
                <div className="flex items-center gap-4">
                  {/* Ikon Keranjang dengan background kuning bulat */}
                  <div className="bg-[#FFA800] w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    {/* Menggunakan Inline SVG agar tidak perlu impor gambar luar */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  
                  {/* Teks Total Pesanan */}
                  <div className="flex flex-col">
                    <span className="text-[#1B2B65] text-lg font-semibold">Total Pesanan :</span>
                    <span className="text-[#1B2B65] text-2xl font-black leading-none">{totalOrders}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    );
  }
}