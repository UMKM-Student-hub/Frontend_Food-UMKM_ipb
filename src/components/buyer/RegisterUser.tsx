import React, { type ChangeEvent, type FormEvent } from 'react';
import { AuthService } from '../../services/AuthService';
import { UserRole } from '../../domain/enums';
import type { RegisterRequest } from '../../domain/User';
import { Link } from 'react-router-dom';

interface RegisterFormProps {
  // Callback (delegate) ke parent component jika register sukses
  // Parent (AuthPage) nanti yang bertugas pindah tab ke 'login'
  onRegisterSuccess: () => void; 
}

interface RegisterFormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isLoading: boolean;
  error: string | null;
}

export class RegisterUser extends React.Component<RegisterFormProps, RegisterFormState> {
  // Injeksi dependensi service layer
  private authService: AuthService;

  constructor(props: RegisterFormProps) {
    super(props);
    this.authService = new AuthService();
    
    // Enkapsulasi state lokal khusus untuk pendaftaran
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: UserRole.BUYER, // Default sebagai Sobat Kuliner (Mahasiswa IPB)
      isLoading: false,
      error: null,
    };
  }

  // Abstraksi method untuk handle semua input text
  private handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as unknown as Pick<RegisterFormState, keyof RegisterFormState>);
  };

  // Logika bisnis pengiriman data (memenuhi pola error handling wajib)
  private handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Reset error dan set loading ke true
    this.setState({ isLoading: true, error: null });

    const { name, email, phone, password, role } = this.state;
    const payload: RegisterRequest = { name, email, phone, password, role };

    try {
      // Panggil API lewat class Service, bukan fetch() langsung
      await this.authService.register(payload);
      
      // Jika berhasil, beri tahu parent komponen untuk pindah tab
      this.props.onRegisterSuccess();
    } catch (err: any) {
      // Tangkap pesan error dari ApiService
      this.setState({ error: err.message || 'Gagal mendaftar. Silakan coba lagi.' });
    } finally {
      // Wajib di-set false di blok finally agar tidak stuck loading
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { name, email, phone, password, role, isLoading, error } = this.state;
    const isBuyer = role === UserRole.BUYER;

    return (
      <div className="animate-fade-in font-sans">
        {/* Header Register */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0c2368] mb-2">
            Daftar Sebagai {isBuyer ? 'Sobat Kuliner UniBites' : 'Mitra UMKM'}
          </h2>
          <p className="text-sm text-gray-700">
            UniBites: Digitalisasi Ekosistem UMKM & Kuliner Kampus IPB Melalui Platform Web Terintegrasi
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Form Input */}
        <form onSubmit={this.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={this.handleInputChange}
              disabled={isLoading}
              required
              className="w-full bg-[#e5e7eb] border-transparent rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-[#0c2368] focus:ring-2 focus:ring-[#0c2368] outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleInputChange}
              disabled={isLoading}
              required
              className="w-full bg-[#e5e7eb] border-transparent rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-[#0c2368] focus:ring-2 focus:ring-[#0c2368] outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No Telepon</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={this.handleInputChange}
              disabled={isLoading}
              required
              className="w-full bg-[#e5e7eb] border-transparent rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-[#0c2368] focus:ring-2 focus:ring-[#0c2368] outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buat Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
              disabled={isLoading}
              required
              minLength={6}
              className="w-full bg-[#e5e7eb] border-transparent rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-[#0c2368] focus:ring-2 focus:ring-[#0c2368] outline-none transition-all disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0c2368] hover:bg-[#0a1b52] text-white font-semibold py-4 rounded-full mt-6 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        {/* Link ke Halaman Register Mitra */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Daftar sebagai </span>
          <Link
            to="/register-mitra" // Arahkan ke path rute baru kamu
            className="text-[#0c2368] hover:text-[#0a1b52] font-semibold underline decoration-2 underline-offset-4"
          >
            Mitra UMKM
          </Link>
        </div>
      </div>
    );
  }
}