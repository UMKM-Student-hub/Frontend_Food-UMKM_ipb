import React from 'react';
import { RegisterAdmin } from '../../components/seller/RegisterAdmin';
import { LoginAdmin } from '../../components/seller/LoginAdmin';

interface AdminPageState {
  activeTab: 'login' | 'register';
  successMessage: string | null;
}

export class RegisterAdminPage extends React.Component<{}, AdminPageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      activeTab: 'register', // Default ke register sesuai desain
      successMessage: null,
    };
  }

  private switchTab = (tab: 'login' | 'register'): void => {
    this.setState({ activeTab: tab, successMessage: null });
  };

  private handleRegisterSuccess = (): void => {
    this.setState({
      activeTab: 'login',
      successMessage: 'Pendaftaran UMKM berhasil! Silakan masuk untuk melengkapi profil toko Anda.',
    });
  };

  private handleLoginSuccess = (): void => {
    // Karena ini form admin, langsung tendang ke dashboard seller
    window.location.href = '/seller';
  };

  render() {
    const { activeTab, successMessage } = this.state;
    const isRegister = activeTab === 'register';

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEF0D4] p-4 font-sans">
        
        {/* WRAPPER BARU: relative, lebar 2xl agar luas */}
        <div className="relative w-full max-w-2xl">
          
          {/* MASKOT BAWANG: Menggunakan gambar yang sama */}
          <img 
            src="/images/logo-form.png" 
            alt="Maskot UniBites" 
            className="absolute z-20 w-[190px] -right-[90px] top-1/2 -translate-y-1/2 drop-shadow-2xl hidden md:block pointer-events-none"
          />

          {/* KOTAK FORM PUTIH */}
          <div className="bg-white rounded-3xl shadow-xl w-full overflow-hidden flex flex-col relative z-10">
            
            {/* Header Navigation Tabs */}
            <div className="flex border-b border-gray-200 text-lg font-bold">
              <button
                type="button"
                onClick={() => this.switchTab('register')}
                className={`w-1/2 py-4 text-center transition-colors ${
                  isRegister ? 'text-[#0c2368] border-b-4 border-[#0c2368]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Daftar
              </button>
              <button
                type="button"
                onClick={() => this.switchTab('login')}
                className={`w-1/2 py-4 text-center transition-colors ${
                  !isRegister ? 'text-[#0c2368] border-b-4 border-[#0c2368]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Masuk
              </button>
            </div>

            <div className="px-12 pt-8 pb-10">
              
              {/* Judul & Subjudul Khusus Mitra */}
                <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#0c2368] mb-2">
                    {isRegister ? 'Mari Bergabung Jadi Mitra UniBites' : 'Masuk Ke Akun Admin'}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                    UniBites: Digitalisasi Ekosistem UMKM & Kuliner Kampus IPB Melalui Platform Web Terintegrasi
                </p>
                </div>

              {/* Global Success Banner */}
              {successMessage && !isRegister && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
                  <p className="text-sm text-green-700 font-medium">{successMessage}</p>
                </div>
              )}

              {/* Rendering Child Component berdasarkan Tab */}
              {isRegister ? (
                 <RegisterAdmin 
                    onRegisterSuccess={this.handleRegisterSuccess} 
                    onSwitchToLogin={() => this.switchTab('login')} 
                 />
              ) : (
                 <LoginAdmin onLoginSuccess={this.handleLoginSuccess} />
              )}
              
            </div>
          </div>

        </div>
      </div>
    );
  }
}