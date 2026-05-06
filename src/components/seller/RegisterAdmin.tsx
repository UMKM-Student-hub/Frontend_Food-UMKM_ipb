import React, { type ChangeEvent, type FormEvent } from 'react';
import { AuthService } from '../../services/AuthService';
// Import 'umkmService' dengan huruf kecil sesuai dengan yang di-export di file aslinya
import { umkmService } from '../../services/UMKMService';
import { UserRole } from '../../domain/enums';

interface RegisterAdminProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

interface RegisterAdminState {
  namaUMKM: string;
  email: string;
  phone: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

export class RegisterAdmin extends React.Component<RegisterAdminProps, RegisterAdminState> {
  // Hanya simpan authService di sini, umkmService kita pakai langsung dari import
  private authService: AuthService;

  constructor(props: RegisterAdminProps) {
    super(props);
    this.authService = new AuthService();
    this.state = {
      namaUMKM: '',
      email: '',
      phone: '',
      password: '',
      isLoading: false,
      error: null,
    };
  }

  private handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ [e.target.name]: e.target.value } as unknown as Pick<RegisterAdminState, keyof RegisterAdminState>);
  };

  private handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null });

    const { namaUMKM, email, phone, password } = this.state;

    try {
      // TAHAP 1: Daftarkan User sebagai SELLER
      await this.authService.register({
        name: namaUMKM, // Pakai nama UMKM sebagai nama profil
        email,
        phone,
        password,
        role: UserRole.SELLER,
      });

      // TAHAP 2: Auto-Login untuk mendapatkan Token
      const loginResponse = await this.authService.login({ email, password });
      this.authService.setToken(loginResponse.access_token);

      // TAHAP 3: Buatkan entitas UMKM menggunakan instance umkmService yang di-import
      await umkmService.createUMKM({
        name: namaUMKM,
        description: "Selamat datang di toko kami!",
        location: "Alamat belum diatur",
      });

      this.props.onRegisterSuccess();
    } catch (err: any) {
      this.setState({
        error: err.message || 'Gagal mendaftarkan akun UMKM.',
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { namaUMKM, email, phone, password, isLoading, error } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 font-medium mb-1">Nama UMKM</label>
          <input
            type="text"
            name="namaUMKM"
            value={namaUMKM}
            onChange={this.handleChange}
            required
            className="bg-gray-200 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0c2368] transition-all"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 font-medium mb-1">Alamat Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleChange}
            required
            className="bg-gray-200 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0c2368] transition-all"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 font-medium mb-1">No Telepon</label>
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={this.handleChange}
            required
            className="bg-gray-200 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0c2368] transition-all"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 font-medium mb-1">Buat Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            required
            minLength={6}
            className="bg-gray-200 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0c2368] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0c2368] hover:bg-[#0a1b52] text-white font-bold py-3 rounded-xl transition-colors mt-4 disabled:bg-gray-400 shadow-md"
        >
          {isLoading ? 'Mendaftarkan...' : 'Daftar'}
        </button>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Sudah punya akun? </span>
          <button
            type="button"
            onClick={this.props.onSwitchToLogin}
            className="text-[#0c2368] font-semibold underline"
          >
            Masuk
          </button>
        </div>
      </form>
    );
  }
}