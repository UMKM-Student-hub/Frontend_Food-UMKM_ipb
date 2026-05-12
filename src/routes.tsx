import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./layouts/MainLayout.tsx";
import SellerLayout from "./layouts/SellerLayout.tsx";
import { SellerGuard } from "./guards/SellerGuard.tsx";

const Loader = () => (
  <div className="flex justify-center items-center h-screen text-green-700">
    Loading UniBites...
  </div>
);

const HomePage = lazy(() => import("./pages/buyer/Home.tsx"));
const DealsPage = lazy(() => import("./pages/buyer/DealsPage.tsx"));
const ProfilePage = lazy(() => import("./pages/buyer/ProfilePage.tsx"));
// Kita sesuaikan import-nya agar bisa membaca named export 'AuthPage' dari UserLoginRegister.tsx
const AuthPage = lazy(() => 
  import("./pages/auth/UserLoginRegister.tsx").then(module => ({ default: module.AuthPage }))
);
const ProductDetailPage = lazy(() => import("./pages/buyer/ProductDetailPage.tsx"));
const MyOrdersPage = lazy(() => 
  import("./pages/buyer/Pesanan.tsx").then(module => ({ default: module.MyOrdersPage }))
);
const AdminLoginRegister = lazy(() => 
  import("./pages/auth/AdminLoginRegister.tsx").then(module => ({ default: module.RegisterAdminPage }))
);


const SellerDashboardPage = lazy(
  () => import("./pages/seller/SellerDashboardPage.tsx"),
);
const ProductManagementPage = lazy(
  () => import("./pages/seller/ProductManagementPage.tsx"),
);
const IncomingOrdersPage = lazy(
  () => import("./pages/seller/IncomingOrdersPage.tsx"),
);
const PromoManagementPage = lazy(
  () => import("./pages/seller/PromoManagementPage.tsx"),
);

// --- WRAPPER UNTUK CLASS COMPONENT ---
// Wrapper ini berfungsi mengambil parameter URL (umkmId) menggunakan hook useParams
// dan mengirimkannya sebagai props ke Class Component ProductDetailPage.
const ProductDetailPageWrapper = () => {
  const params = useParams();
  return (
    <Suspense fallback={<Loader />}>
      {/* Mengoper params ke komponen agar bisa diakses via this.props.params.umkmId */}
      <ProductDetailPage params={params} />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<Loader />}>
            {/* Gunakan AuthPage yang baru */}
            <AuthPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<Loader />}>
            {/* Gunakan komponen yang sama untuk register, karena ada tab navigasinya */}
            <AuthPage />
          </Suspense>
        ),
      },
      {
        path: "register-mitra", 
        element: (
          <Suspense fallback={<Loader />}>
            <AdminLoginRegister />
          </Suspense>
        ),
      },
      {
        path: "my-orders", // Path sesuai spesifikasi dokumen 
        element: (
          <Suspense fallback={<Loader />}>
            {/* Dibungkus BuyerGuard karena hanya boleh diakses mahasiswa (BUYER) 
              sesuai aturan keamanan sistem [cite: 186, 506]
            */}
            <SellerGuard>
              <MyOrdersPage />
            </SellerGuard>
          </Suspense>
      ),
      },
      {
        path: "home",
        element: (
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        ),
      },
      
      // === RUTE BARU UNTUK HALAMAN DETAIL KANTIN ===
      {
        path: "catalog/:umkmId",
        element: <ProductDetailPageWrapper />,
      },
      // =============================================
      {
        path: "deals",
        element: (
          <Suspense fallback={<Loader />}>
            <DealsPage />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "/seller",
    element: <SellerLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <SellerDashboardPage />
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<Loader />}>
            <IncomingOrdersPage />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<Loader />}>
            <ProductManagementPage />
          </Suspense>
        ),
      },
      {
        path: "promos",
        element: (
          <Suspense fallback={<Loader />}>
            <PromoManagementPage />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "*",
    element: (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-4xl font-bold text-[#1B2B65] mb-4">404</h1>
        <p className="text-xl text-gray-600">Halaman Tidak Ditemukan</p>
      </div>
    ),
  },
]);

export default router;
