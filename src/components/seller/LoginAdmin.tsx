import { Component } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthService } from "../../services/AuthService";
import { UserRole } from "../../domain/enums";

interface LoginAdminProps {
  onLoginSuccess: () => void;
}

interface LoginAdminState {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
}

export class LoginAdmin extends Component<LoginAdminProps, LoginAdminState> {
  private authService = new AuthService();

  state: LoginAdminState = {
    email: "",
    password: "",
    showPassword: false,
    isLoading: false,
    error: null,
  };

  private handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    } as unknown as Pick<LoginAdminState, keyof LoginAdminState>);
  };

  private togglePasswordVisibility = (): void => {
    this.setState((prev) => ({ showPassword: !prev.showPassword }));
  };

  private handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null });

    const { email, password } = this.state;

    try {
      const loginResponse = await this.authService.login({ email, password });
      this.authService.setToken(loginResponse.access_token);

      const user = await this.authService.getMe();
      if (user.role !== UserRole.SELLER) {
        this.authService.clearAuth();
        throw new Error("Akses ditolak. Akun ini bukan akun Mitra UMKM.");
      }

      localStorage.setItem("user_role", UserRole.SELLER);
      this.props.onLoginSuccess();
    } catch (err: unknown) {
      let errorMsg = "Email atau password salah.";
      const errorObj = err as Record<string, any>;

      if (errorObj?.response?.data?.detail) {
        const detail = errorObj.response.data.detail;
        errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }

      this.setState({ error: errorMsg });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { email, password, showPassword, isLoading, error } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold shadow-sm animate-fadeIn">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700 tracking-wide px-1">
            Alamat Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleChange}
            disabled={isLoading}
            required
            placeholder="email.mitra@domain.com"
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#1B2B65] focus:ring-4 focus:ring-[#1B2B65]/10 outline-none transition-all disabled:opacity-60 font-medium shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700 tracking-wide px-1">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={this.handleChange}
              disabled={isLoading}
              required
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-5 pr-12 py-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#1B2B65] focus:ring-4 focus:ring-[#1B2B65]/10 outline-none transition-all disabled:opacity-60 font-medium shadow-sm"
            />
            <button
              type="button"
              onClick={this.togglePasswordVisibility}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1B2B65] hover:bg-[#102A71] text-white font-bold py-4 rounded-full mt-4 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </button>

        <div className="mt-6 flex flex-col gap-4 text-center text-sm font-medium">
          <div className="relative flex items-center justify-center">
            <div className="absolute border-t border-gray-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-gray-400 relative z-10 uppercase tracking-wider font-bold">
              ATAU
            </span>
          </div>

          <div>
            <span className="text-gray-500">Ingin memesan makanan? </span>
            <Link
              to="/login"
              className="text-[#1B2B65] font-bold hover:underline transition-all"
            >
              Masuk sebagai Pembeli
            </Link>
          </div>
        </div>
      </form>
    );
  }
}
