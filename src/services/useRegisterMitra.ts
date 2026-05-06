// src/hooks/useRegisterMitra.ts
import { useState } from "react";
import { authService } from "../services/AuthService";
import { umkmService } from "../services/UMKMService";
import { UserRole } from "../types/enums";

export interface RegisterMitraFormData {
  namaLengkap: string;
  email: string;
  noTelepon: string;
  password: string;
  namaUMKM: string;
}

export function useRegisterMitra() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRegistration = async (
    formData: RegisterMitraFormData,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // TAHAP 1: Daftarkan User sebagai SELLER
      await authService.register({
        name: formData.namaLengkap,
        email: formData.email,
        phone: formData.noTelepon,
        password: formData.password,
        role: UserRole.SELLER,
      });

      // TAHAP 2: Auto-Login untuk mendapatkan Token
      const loginResponse = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Simpan token ke localStorage.
      // ApiService akan otomatis membaca ini di request berikutnya!
      localStorage.setItem("access_token", loginResponse.access_token);
    } catch (err: any) {
      // PERBAIKAN: Menggunakan err.message karena ApiService melempar objek Error standar
      setError(
        err.message ||
          "Gagal mendaftarkan akun. Silakan periksa kembali data Anda.",
      );
      setIsLoading(false);
      return false;
    }

    try {
      // TAHAP 3: Buatkan entitas UMKM
      // (Tanpa passing token, ApiService mengambilnya otomatis dari localStorage)
      await umkmService.createUMKM({
        name: formData.namaUMKM,
        description: "Selamat datang di toko kami!", // Default system value
        location: "Alamat belum diatur", // Default system value
      });

      setIsLoading(false);
      return true; // Sinyal sukses ke UI
    } catch (err: any) {
      setError(
        "Akun berhasil dibuat, namun gagal mendaftarkan nama UMKM. Silakan login dan lengkapi profil toko Anda di Dashboard.",
      );
      setIsLoading(false);
      return false;
    }
  };

  return { executeRegistration, isLoading, error };
}
