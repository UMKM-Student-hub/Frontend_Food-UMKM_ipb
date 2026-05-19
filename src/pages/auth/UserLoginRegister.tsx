import { Component } from "react";
import { LoginUser } from "../../components/buyer/LoginUser";
import { RegisterUser } from "../../components/buyer/RegisterUser";
import { UserRole } from "../../domain/enums";

interface AuthPageState {
  activeTab: "login" | "register";
  successMessage: string | null;
}

export class AuthPage extends Component<{}, AuthPageState> {
  constructor(props: {}) {
    super(props);
    const currentPath = window.location.pathname;

    this.state = {
      activeTab: currentPath === "/register" ? "register" : "login",
      successMessage: null,
    };
  }

  private switchTab = (tab: "login" | "register"): void => {
    this.setState({ activeTab: tab, successMessage: null });
    window.history.pushState({}, "", `/${tab}`);
  };

  private handleRegisterSuccess = (): void => {
    this.setState({
      activeTab: "login",
      successMessage:
        "Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.",
    });
    window.history.pushState({}, "", "/login");
  };

  private handleLoginSuccess = (): void => {
    const role = localStorage.getItem("user_role");

    if (role === UserRole.BUYER) {
      window.location.href = "/home";
    } else if (role === UserRole.SELLER) {
      window.location.href = "/seller";
    } else {
      window.location.href = "/";
    }
  };

  render() {
    const { activeTab, successMessage } = this.state;
    const isRegister = activeTab === "register";

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEF0D4] p-4 sm:p-6 md:p-8 font-sans">
        <div className="relative w-full max-w-md md:max-w-2xl">
          <img
            src="/images/logo-form.png"
            alt="Maskot UniBites"
            className="absolute z-20 w-47.5 -right-22.5 top-1/2 -translate-y-1/2 drop-shadow-2xl hidden md:block pointer-events-none"
          />

          <div className="bg-white rounded-4xl shadow-2xl w-full overflow-hidden flex flex-col relative z-10 border border-white/40">
            <div className="flex border-b border-gray-100 text-lg font-bold bg-gray-50/50">
              <button
                type="button"
                onClick={() => this.switchTab("register")}
                className={`w-1/2 py-5 text-center transition-all duration-300 ${
                  isRegister
                    ? "text-[#1B2B65] border-b-4 border-[#1B2B65] bg-white"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
                }`}
              >
                Daftar
              </button>
              <button
                type="button"
                onClick={() => this.switchTab("login")}
                className={`w-1/2 py-5 text-center transition-all duration-300 ${
                  !isRegister
                    ? "text-[#1B2B65] border-b-4 border-[#1B2B65] bg-white"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
                }`}
              >
                Masuk
              </button>
            </div>

            <div className="px-6 sm:px-10 md:px-12 pt-8 pb-12">
              {successMessage && !isRegister && (
                <div className="bg-green-50 border border-green-200 p-4 mb-8 rounded-2xl shadow-sm animate-fadeIn flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-green-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-green-700 font-bold">
                    {successMessage}
                  </p>
                </div>
              )}

              {isRegister ? (
                <RegisterUser
                  onRegisterSuccess={this.handleRegisterSuccess}
                  onSwitchToLogin={() => this.switchTab("login")}
                />
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
