import { Component } from "react";

interface ProfileHeaderProps {
  umkmName: string;
  email: string;
  isEditing: boolean;
  isSubmitting: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onLogout: () => void;
}

export class ProfileHeader extends Component<ProfileHeaderProps> {
  render() {
    const {
      umkmName,
      email,
      isEditing,
      isSubmitting,
      onEdit,
      onCancel,
      onLogout,
    } = this.props;

    return (
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B2B65] mb-2 break-words">
            {umkmName || "Nama Kantin"}
          </h1>
          <p className="text-gray-500 text-base md:text-lg font-medium">
            {email}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md active:scale-95"
              >
                Edit Profil
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="p-2.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all group"
                title="Logout"
              >
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
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
    );
  }
}
