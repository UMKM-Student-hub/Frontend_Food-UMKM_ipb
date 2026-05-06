import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./layouts/MainLayout.tsx";
import SellerLayout from "./layouts/SellerLayout.tsx";
// import { SellerGuard } from "./guards/SellerGuard.tsx"; // Di-comment sementara untuk testing

const Loader = () => (
  <div className="flex justify-center items-center h-screen text-green-700">
    Loading UniBites...
  </div>
);

const HomePage = lazy(() => import("./pages/buyer/Home.tsx"));
const DealsPage = lazy(() => import("./pages/buyer/DealsPage.tsx"));
const ProfilePage = lazy(() => import("./pages/buyer/ProfilePage.tsx"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage.tsx"));

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
            <LoginPage />
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
