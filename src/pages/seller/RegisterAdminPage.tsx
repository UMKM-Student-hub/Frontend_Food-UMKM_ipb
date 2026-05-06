import React, { Component } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';
import { UserRole } from '../../domain/enums';

interface RegisterAdminState {
  name: string;
  email: string;
  phone: string; 
  password: string;
  isLoading: boolean;
  error: string | null;
  redirectToLogin: boolean;
}

export default class RegisterAdminPage extends Component<{}, RegisterAdminState> {
  private authService = new AuthService();

  constructor(props: {}) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      isLoading: false,
      error: null,
      redirectToLogin: false,
    };
  }

  // Handler dinamis untuk semua input form
  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Pick<RegisterAdminState, keyof RegisterAdminState>);
  };

  private handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const { name, email, phone, password } = this.state;

    // Validasi cukup 4 field ini saja
    if (!name || !email || !phone || !password) {
      this.setState({ error: 'Semua kolom wajib diisi.' });
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      // Panggil Service Layer dengan Role SELLER
      await this.authService.register({
        name,
        email,
        password,
        phone,
        role: UserRole.SELLER,
      });

      // Catatan: Setelah registrasi akun sukses, pembuatan profil UMKM
      // biasanya dilakukan di backend secara otomatis atau lewat step selanjutnya.
      
      // Redirect ke halaman login setelah berhasil
      this.setState({ redirectToLogin: true });
      
    } catch (err: any) {
      this.setState({ error: err.message || 'Gagal mendaftar. Silakan coba lagi.' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { name, email, phone, password, isLoading, error, redirectToLogin } = this.state;

    // Redirect declarative khas Class Component di React Router v6
    if (redirectToLogin) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="min-h-screen flex flex-col bg-[#FDFDFD] font-sans relative overflow-x-hidden">
        
        {/* --- HEADER LOGO --- */}
        <div className="absolute top-6 left-6 lg:top-8 lg:left-12 z-20 flex items-center gap-3">
          <img src="/images/logo-navbar.png" alt="UniBites Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <span className="text-[#1B2B65] font-extrabold text-2xl tracking-wide">UniBites</span>
        </div>

        {/* --- MAIN CONTENT CENTERED --- */}
        <main className="flex-grow flex items-center justify-center p-6 mt-16 md:mt-0 z-10 relative">
          
          {/* Wrapper untuk Form dan Maskot agar posisinya presisi */}
          <div className="relative w-full max-w-[600px]">
            
            {/* Form Card */}
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-gray-100 relative z-10">
              
              {/* TABS (Daftar / Masuk) */}
              <div className="flex w-full border-b-2 border-gray-100">
                <div className="w-1/2 py-5 text-center cursor-default border-b-4 border-[#1B2B65]">
                  <span className="text-[#1B2B65] font-extrabold text-xl">Daftar</span>
                </div>
                <Link to="/login" className="w-1/2 py-5 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="text-gray-400 font-bold text-xl">Masuk</span>
                </Link>
              </div>

              {/* Form Body */}
              <div className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-[28px] font-extrabold text-[#1B2B65] mb-2 leading-tight">
                    Mari Bergabung Jadi Mitra UniBites
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed">
                    UniBites: Digitalisasi Ekosistem UMKM & Kuliner <br className="hidden md:block" />
                    Kampus IPB Melalui Platform Web Terintegrasi
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={this.handleSubmit} className="flex flex-col gap-5">
                  
                  {/* Nama Kantin (Secara sistem disimpan ke field User 'name') */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Nama Kantin / UMKM</label>
                    <input 
                      type="text" 
                      name="name" // Tetap menggunakan properti 'name' untuk state
                      value={name} 
                      onChange={this.handleInputChange}
                      placeholder="Contoh: Kantin Stekpi, Ayam Geprek Juara..."
                      className="w-full bg-[#EAEAEA] text-[#1B2B65] font-medium rounded-xl px-4 py-3.5 outline-none focus:ring-2 ring-[#1B2B65] transition-all"
                    />
                  </div>

                  {/* Alamat Email */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Alamat Email</label>
                    <input 
                      type="email" name="email" value={email} onChange={this.handleInputChange}
                      className="w-full bg-[#EAEAEA] text-[#1B2B65] font-medium rounded-xl px-4 py-3.5 outline-none focus:ring-2 ring-[#1B2B65] transition-all"
                    />
                  </div>

                  {/* No Telepon */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">No Telepon</label>
                    <input 
                      type="tel" name="phone" value={phone} onChange={this.handleInputChange}
                      className="w-full bg-[#EAEAEA] text-[#1B2B65] font-medium rounded-xl px-4 py-3.5 outline-none focus:ring-2 ring-[#1B2B65] transition-all"
                    />
                  </div>

                  {/* Buat Password */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Buat Password</label>
                    <input 
                      type="password" name="password" value={password} onChange={this.handleInputChange}
                      className="w-full bg-[#EAEAEA] text-[#1B2B65] font-medium rounded-xl px-4 py-3.5 outline-none focus:ring-2 ring-[#1B2B65] transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`mt-4 w-full rounded-2xl py-4 font-bold text-lg text-white transition-all shadow-md 
                      ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1B2B65] hover:bg-[#102A71] active:scale-[0.98]'}`}
                  >
                    {isLoading ? 'Mendaftarkan...' : 'Daftar'}
                  </button>

                  <div className="text-center mt-2">
                    <span className="text-gray-600 font-medium">Sudah punya akun? </span>
                    <Link to="/login" className="text-[#1B2B65] font-bold underline hover:text-[#FFA800] transition-colors">
                      Masuk
                    </Link>
                  </div>

                </form>
              </div>
            </div>

            {/* Maskot Tumpang Tindih (Absolute positioning di luar kotak) */}
            <img 
              src="/images/logo-footer.png" // Ganti dengan nama file maskot yang membawa piring
              alt="Mascot UniBites" 
              className="hidden lg:block absolute -right-40 top-1/2 transform -translate-y-[40%] w-[280px] z-20 drop-shadow-2xl"
            />
          </div>
        </main>


      </div>
    );
  }
}