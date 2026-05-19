import { Component } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ApiService } from "../../services/ApiService";
import { ProfileHeader } from "../../components/seller/ProfileHeader";
import { ProfileField } from "../../components/seller/ProfileField";
import { LogoutModal } from "../../components/seller/LogoutModal";

interface ProfileData {
  umkmName: string;
  email: string;
  ownerName: string;
  phone: string;
  location: string;
}

class ProfileApiService extends ApiService {
  async getProfile(): Promise<ProfileData> {
    return this.get<ProfileData>("/auth/me/profile");
  }
  async updateProfile(payload: Partial<ProfileData>): Promise<ProfileData> {
    return this.patch<ProfileData>("/auth/me/profile", payload);
  }
}

interface ProfilePageState {
  profile: ProfileData;
  isEditing: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isLogoutModalOpen: boolean;
}

export default class ProfilePage extends Component<{}, ProfilePageState> {
  private profileService = new ProfileApiService();

  state: ProfilePageState = {
    profile: {
      umkmName: "",
      email: "",
      ownerName: "",
      phone: "",
      location: "",
    },
    isEditing: false,
    isLoading: true,
    isSubmitting: false,
    error: null,
    isLogoutModalOpen: false,
  };

  componentDidMount() {
    this.fetchProfileData();
  }

  private fetchProfileData = async () => {
    try {
      const data = await this.profileService.getProfile();
      this.setState({ profile: data, isLoading: false });
    } catch (err: any) {
      this.setState({ error: err.message, isLoading: false });
    }
  };

  private handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prev) => ({ profile: { ...prev.profile, [name]: value } }));
  };

  private openLogoutModal = () => {
    this.setState({ isLogoutModalOpen: true });
  };

  private closeLogoutModal = () => {
    this.setState({ isLogoutModalOpen: false });
  };

  private handleLogoutConfirm = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  private handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    this.setState({ isSubmitting: true });
    try {
      const updated = await this.profileService.updateProfile(
        this.state.profile,
      );
      this.setState({
        profile: updated,
        isEditing: false,
        isSubmitting: false,
      });
    } catch (err: any) {
      this.setState({ error: err.message, isSubmitting: false });
    }
  };

  render() {
    const { profile, isEditing, isLoading, isSubmitting, isLogoutModalOpen } =
      this.state;

    if (isLoading)
      return (
        <div className="flex h-96 items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );

    return (
      <div className="w-full max-w-4xl mx-auto pt-8 pb-24 px-4">
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={this.closeLogoutModal}
          onConfirm={this.handleLogoutConfirm}
        />

        <div className="bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-gray-50 p-6 md:p-12">
          <form onSubmit={this.handleSubmit}>
            <ProfileHeader
              umkmName={profile.umkmName}
              email={profile.email}
              isEditing={isEditing}
              isSubmitting={isSubmitting}
              onEdit={() => this.setState({ isEditing: true })}
              onCancel={() => {
                this.setState({ isEditing: false });
                this.fetchProfileData();
              }}
              onLogout={this.openLogoutModal}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfileField
                id="ownerName"
                label="Nama Pemilik Kantin"
                name="ownerName"
                value={profile.ownerName}
                placeholder="Nama Lengkap"
                disabled={!isEditing}
                onChange={this.handleInputChange}
              />
              <ProfileField
                id="phone"
                label="Nomor Handphone"
                name="phone"
                value={profile.phone}
                placeholder="0812..."
                disabled={!isEditing}
                onChange={this.handleInputChange}
              />
              <div className="md:col-span-2">
                <ProfileField
                  id="location"
                  label="Lokasi / Alamat Kantin"
                  name="location"
                  value={profile.location}
                  placeholder="Gedung/Lantai/Kantin nomor..."
                  disabled={!isEditing}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
