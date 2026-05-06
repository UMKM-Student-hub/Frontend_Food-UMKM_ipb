import React from 'react';
import { LoginUser } from '../../components/buyer/LoginUser';
import { RegisterUser } from '../../components/buyer/RegisterUser';
import { UserRole } from '../../domain/enums';

interface AuthPageState {
  activeTab: 'login' | 'register';
  successMessage: string | null;
}

export class AuthPage extends React.Component<{}, AuthPageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      activeTab: 'login', // Default tab
      successMessage: null,
    };
  }

  // Method untuk handle perpindahan tab
  private switchTab = (tab: 'login' | 'register'): void => {
    this.setState({ activeTab: tab, successMessage: null });
  };

  // Callback dari RegisterForm saat sukses daftar
  private handleRegisterSuccess = (): void => {
    this.setState({
      activeTab: 'login', // Otomatis pindah ke tab login
      successMessage: 'Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.',
    });
  };

  // Callback dari LoginForm saat sukses login
  private handleLoginSuccess = (role: UserRole): void => {
    // Sesuai aturan routing: redirect ke /catalog untuk BUYER, /seller untuk SELLER
    if (role === UserRole.BUYER) {
      window.location.href = '/catalog';
    } else {
      window.location.href = '/seller';
    }
  };

  render() {
    const { activeTab, successMessage } = this.state;
    const isRegister = activeTab === 'register';

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEF0D4] p-4 font-sans">
        
        {/* WRAPPER BARU: relative, w-full, max-w-md agar form dan maskot sejajar */}
        <div className="relative w-full max-w-2xl">
          
          {/* MASKOT BAWANG: Absolute positioning, memanggil gambar dari public/images/ */}
          <img 
            src="/images/logo-form.png" 
            alt="Maskot UniBites" 
            className="absolute z-20 w-[190px] -right-[90px] top-1/2 -translate-y-1/2 drop-shadow-2xl hidden md:block pointer-events-none"
          />

          {/* KOTAK FORM PUTIH: Ditambahkan "relative z-10" agar ada di bawah lengan maskot */}
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

            <div className="px-12 pt-6 pb-10">
              {/* Global Success Banner */}
              {successMessage && !isRegister && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
                  <p className="text-sm text-green-700 font-medium">{successMessage}</p>
                </div>
              )}

              {/* Rendering Child Component berdasarkan Tab */}
              {isRegister ? (
                 <RegisterUser onRegisterSuccess={this.handleRegisterSuccess} />
              ) : (
                 <LoginUser onLoginSuccess={this.handleLoginSuccess} />
              )}
              
            </div>
          </div>

        </div>
      </div>
    );
  }
}