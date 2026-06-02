import {
  createBrowserRouter,
  Navigate,
  useParams,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
import { lazy } from "react";
import MainLayout from "./layouts/MainLayout.tsx";
import SellerLayout from "./layouts/SellerLayout.tsx";
import { SellerGuard } from "./guards/SellerGuard.tsx";
import { BuyerGuard } from "./guards/BuyerGuard.tsx";
import { ErrorBanner } from "./components/common/ErrorBanner";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";

const GlobalErrorPage = () => {
  const error = useRouteError();
  let errorMessage = "Terjadi kesalahan sistem yang tidak terduga.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorMessage =
        "Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.";
    } else {
      errorMessage = `${error.status} - ${error.statusText || error.data}`;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] font-sans">
      <Navbar />
      <div className="grow flex flex-col items-center justify-center p-6">
        <ErrorBanner
          message={errorMessage}
          onRetry={() => window.location.reload()}
        />
        <a
          href="/"
          className="mt-6 bg-[#1B2B65] text-white px-8 py-3 rounded-full font-bold hover:bg-[#102A71] transition-colors shadow-md"
        >
          Kembali ke Beranda
        </a>
      </div>
      <Footer />
    </div>
  );
};

const HomePage = lazy(() => import("./pages/buyer/Home.tsx"));
const ProfilePage = lazy(() => import("./pages/buyer/ProfilePage.tsx"));
const AuthPage = lazy(() =>
  import("./pages/auth/UserLoginRegister.tsx").then((m) => ({
    default: m.AuthPage,
  })),
);
const ProductDetailPage = lazy(
  () => import("./pages/buyer/ProductDetailPage.tsx"),
);
const MyOrdersPage = lazy(() =>
  import("./pages/buyer/OrderPage.tsx").then((m) => ({
    default: m.MyOrdersPage,
  })),
);
const AdminLoginRegister = lazy(() =>
  import("./pages/auth/AdminLoginRegister.tsx").then((m) => ({
    default: m.RegisterAdminPage,
  })),
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
const SellerProfilePage = lazy(() => import("./pages/seller/ProfilePage.tsx"));
const StoreReviewsPage = lazy(
  () => import("./pages/seller/StoreReviewsPage.tsx"),
);

const ProductDetailPageWrapper = () => {
  const params = useParams();
  return <ProductDetailPage params={params} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <GlobalErrorPage />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "login", element: <AuthPage /> },
      { path: "register", element: <AuthPage /> },
      { path: "register-mitra", element: <AdminLoginRegister /> },
      { path: "home", element: <HomePage /> },
      { path: "catalog/:umkmId", element: <ProductDetailPageWrapper /> },
      {
        path: "my-orders",
        element: (
          <BuyerGuard>
            <MyOrdersPage />
          </BuyerGuard>
        ),
      },
      {
        path: "profile",
        element: (
          <BuyerGuard>
            <ProfilePage />
          </BuyerGuard>
        ),
      },
    ],
  },
  {
    path: "/seller",
    element: (
      <SellerGuard>
        <SellerLayout />
      </SellerGuard>
    ),
    errorElement: <GlobalErrorPage />,
    children: [
      { index: true, element: <SellerDashboardPage /> },
      { path: "orders", element: <IncomingOrdersPage /> },
      { path: "products", element: <ProductManagementPage /> },
      { path: "promos", element: <PromoManagementPage /> },
      { path: "profile", element: <SellerProfilePage /> },
      { path: "reviews", element: <StoreReviewsPage /> },
    ],
  },
]);

export default router;
