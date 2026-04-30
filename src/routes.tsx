import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./layouts/MainLayout.tsx";

const Loader = () => (
  <div className="flex justify-center items-center h-screen text-green-700">
    Loading UniBites...
  </div>
);

const CatalogPage = lazy(() => import("./pages/buyer/CatalogPage.tsx"));
const DealsPage = lazy(() => import("./pages/buyer/DealsPage.tsx"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/catalog" replace />,
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
        path: "catalog",
        element: (
          <Suspense fallback={<Loader />}>
            <CatalogPage />
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
    ],
  },
  {
    path: "*",
    element: (
      <div className="text-center p-10 text-2xl font-bold">
        404 - Halaman Tidak Ditemukan
      </div>
    ),
  },
]);

export default router;
