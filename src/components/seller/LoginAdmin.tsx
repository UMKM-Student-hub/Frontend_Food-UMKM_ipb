import React, { type ChangeEvent, type FormEvent } from 'react';
import { AuthService } from '../../services/AuthService';
import { UserRole } from '../../domain/enums';

interface LoginAdminProps {
  onLoginSuccess: () => void;
}

interface LoginAdminState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

export class LoginAdmin extends React.Component<LoginAdminProps, LoginAdminState> {
  private authService: AuthService;

  constructor(props: LoginAdminProps) {
    super(props);
    this.authService = new AuthService();
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      error: null,
    };
  }

  private handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ [e.target.name]: e.target.value } as unknown as Pick<LoginAdminState, keyof LoginAdminState>);
  };

  private handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null });

    try {
      // 1. Lakukan Login
      const loginResponse = await this.authService.login({
        email: this.state.email,
        password: this.state.password,
      });

      // 2. Simpan Token
      this.authService.setToken(loginResponse.access_token);

      // 3. Verifikasi Role (Pastikan yang login adalah UMKM/SELLER)
      const user = await this.authService.getMe();
      if (user.role !== UserRole.SELLER) {
        this.authService.clearAuth();
        throw new Error('Akses ditolak. Akun ini bukan akun Mitra UMKM.');
      }

      // 4. Sukses
      this.props.onLoginSuccess();
    } catch (err: any) {
      this.setState({ error: err.message || 'Email atau password salah.' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { email, password, isLoading, error } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

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
          <label className="text-sm text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            required
            className="bg-gray-200 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0c2368] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0c2368] hover:bg-[#0a1b52] text-white font-bold py-3 rounded-xl transition-colors mt-4 disabled:bg-gray-400"
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    );
  }
}