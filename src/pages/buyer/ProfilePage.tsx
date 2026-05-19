import { Component, ChangeEvent, FormEvent } from "react";
import { AuthService } from "../../services/AuthService";
import { OrderService } from "../../services/OrderService";
import type { User } from "../../domain/User";
import { BuyerProfileField } from "../../components/buyer/BuyerProfileField";
import { BuyerLogoutModal } from "../../components/buyer/BuyerLogoutModal";

interface ProfilePageState {
  user: User | null;
  editForm: { name: string; phone: string };
  totalOrders: number;
  isLoading: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  isLogoutModalOpen: boolean;
  error: string | null;
}

export default class ProfilePage extends Component<{}, ProfilePageState> {
  private authService = new AuthService();
  private orderService = new OrderService();

  constructor(props: {}) {
    super(props);
    this.state = {
      user: null,
      editForm: { name: "", phone: "" },
      totalOrders: 0,
      isLoading: true,
      isEditing: false,
      isSubmitting: false,
      isLogoutModalOpen: false,
      error: null,
    };
  }

  async componentDidMount() {
    await this.fetchProfileData();
  }

  private fetchProfileData = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });
    try {
      const [userData, myOrders] = await Promise.all([
        this.authService.getMe(),
        this.orderService.getMyOrders(),
      ]);

      this.setState({
        user: userData,
        editForm: { name: userData.name, phone: userData.phone },
        totalOrders: myOrders.length,
      });
    } catch (err: any) {
      this.setState({ error: err.message || "Gagal memuat profil pengguna." });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      editForm: { ...prev.editForm, [name]: value },
    }));
  };

  private toggleEdit = () => {
    this.setState((prev) => {
      if (prev.isEditing && prev.user) {
        return {
          isEditing: false,
          editForm: { name: prev.user.name, phone: prev.user.phone },
        };
      }
      return { isEditing: true };
    });
  };

  private handleSave = async (e: FormEvent) => {
    e.preventDefault();
    this.setState({ isSubmitting: true, error: null });
    try {
      const updatedUser = await this.authService.updateMe(this.state.editForm);
      this.setState({
        user: updatedUser,
        isEditing: false,
      });
    } catch (err: any) {
      this.setState({ error: err.message });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  private handleLogoutConfirm = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    window.location.href = "/login";
  };

  render() {
    const {
      user,
      editForm,
      totalOrders,
      isLoading,
      isEditing,
      isSubmitting,
      isLogoutModalOpen,
      error,
    } = this.state;

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[60vh] text-[#1B2B65] font-bold text-xl">
          <div className="w-12 h-12 border-4 border-[#FFB20E] border-t-transparent rounded-full animate-spin mr-4"></div>
          Memuat Profil...
        </div>
      );
    }

    if (!user) return null;

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 relative">
        <BuyerLogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => this.setState({ isLogoutModalOpen: false })}
          onConfirm={this.handleLogoutConfirm}
        />

        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm flex justify-between">
            <span>{error}</span>
            <button
              onClick={() => this.setState({ error: null })}
              className="font-bold"
            >
              X
            </button>
          </div>
        )}

        <div className="rounded-[2rem] shadow-xl overflow-hidden flex flex-col">
          <div className="bg-[#FFB20E] px-6 md:px-10 py-6 md:py-8 flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2B65] tracking-wide">
              Profil Saya
            </h1>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={this.toggleEdit}
                    disabled={isSubmitting}
                    className="bg-white text-[#1B2B65] font-bold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={this.handleSave}
                    disabled={isSubmitting}
                    className="bg-[#1B2B65] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#102A71] transition-colors shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={this.toggleEdit}
                    className="bg-[#1B2B65] hover:bg-[#102A71] text-white font-bold px-6 py-2.5 rounded-full transition-colors active:scale-95 shadow-md"
                  >
                    Edit Profil
                  </button>
                  <button
                    onClick={() => this.setState({ isLogoutModalOpen: true })}
                    className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full transition-colors active:scale-95 shadow-md"
                    title="Keluar"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-[#102A71] px-6 md:px-10 py-10 flex flex-col-reverse md:flex-row gap-10 md:gap-16">
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <BuyerProfileField
                label="Nama Lengkap"
                name="name"
                value={editForm.name}
                disabled={!isEditing}
                onChange={this.handleInputChange}
              />
              <BuyerProfileField
                label="No Telpon"
                name="phone"
                value={editForm.phone}
                type="tel"
                disabled={!isEditing}
                onChange={this.handleInputChange}
              />
              <BuyerProfileField
                label="Alamat Email"
                name="email"
                value={user.email}
                type="email"
                disabled={true}
                onChange={this.handleInputChange}
              />
            </div>

            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <h3 className="text-[#1B2B65] font-extrabold text-xl mb-6">
                  Aktivitas Pembeli
                </h3>
                <div className="flex items-center gap-4">
                  <div className="bg-[#FFA800] w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#1B2B65] text-lg font-semibold">
                      Total Pesanan :
                    </span>
                    <span className="text-[#1B2B65] text-2xl font-black leading-none">
                      {totalOrders}
                    </span>
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
