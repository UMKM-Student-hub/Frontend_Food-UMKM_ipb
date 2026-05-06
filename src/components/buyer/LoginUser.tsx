import React, { type ChangeEvent, type FormEvent } from 'react';
import { AuthService } from '../../services/AuthService';
import { UserRole } from '../../domain/enums';
import type { LoginRequest } from '../../domain/User';

interface LoginFormProps {
  // Callback delegate saat login sukses
  onLoginSuccess: (role: UserRole) => void;
}

interface LoginFormState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

export class LoginUser extends React.Component<LoginFormProps, LoginFormState> {
  private authService: AuthService;

  constructor(props: LoginFormProps) {
    super(props);
    this.authService = new AuthService();
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      error: null,
    };
  }

  private handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as unknown as Pick<LoginFormState, keyof LoginFormState>);
  };

  private handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null });

    const { email, password } = this.state;

    try {
      const payload: LoginRequest = { email, password };
      const tokenResponse = await this.authService.login(payload);
      
      this.authService.setToken(tokenResponse.access_token);
      
      // Ambil data user untuk tahu role-nya (BUYER/SELLER)
      const user = await this.authService.getMe();
      
      // Delegasikan ke parent untuk urusan navigasi/redirect
      this.props.onLoginSuccess(user.role);
      
    } catch (err: any) {
      this.setState({ error: err.message || 'Email atau password salah.' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { email, password, isLoading, error } = this.state;

    return (
      <div className="animate-fade-in font-sans">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0c2368] mb-2">Masuk ke UniBites</h2>
          <p className="text-sm text-gray-700">Selamat datang kembali!</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={this.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleInputChange}
              disabled={isLoading}
              required
              className="w-full bg-[#e5e7eb] border-transparent rounded-xl px-6 py-3 text-gray-900 focus:bg-white focus:border-[#0c2368] focus:ring-2 focus:ring-[#0c2368] outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
              disabled={isLoading}
              required
              className="w-full bg-[#e5e7eb] border-transparent rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-[#0c2368] focus:ring-2 focus:ring-[#0c2368] outline-none transition-all disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0c2368] hover:bg-[#0a1b52] text-white font-semibold py-4 rounded-full mt-6 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    );
  }
}