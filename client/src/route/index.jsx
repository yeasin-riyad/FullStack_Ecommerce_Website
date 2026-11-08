
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Dashboard from "../layout/Dashboard";
import AdminPermission from "../components/AdminPermission";

// Lazy loaded pages
const Home = lazy(() => import("../pages/Home"));
const Search = lazy(() => import("../pages/Search"));
const Register = lazy(() => import("../pages/Register"));
const Login = lazy(() => import("../pages/Login"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("../pages/VerifyOtp"));
const PasswordResetForm = lazy(() => import("../pages/PasswordResetForm"));

const UserMenuMobile = lazy(() => import("../pages/UserMenuMobile"));
const MyOrder = lazy(() => import("../pages/MyOrder"));
const Profile = lazy(() => import("../pages/Profile"));
const Address = lazy(() => import("../pages/Address"));

const UploadProduct = lazy(() => import("../pages/UploadProduct"));
const Category = lazy(() => import("../pages/Category"));
const SubCategory = lazy(() => import("../pages/SubCategory"));
const ProductAdmin = lazy(() => import("../pages/ProductAdmin"));

const ProductListPage = lazy(() => import("../pages/ProductListPage"));
const ProductDisplayPage = lazy(() => import("../pages/ProductDisplayPage"));

const CartMobile = lazy(() => import("../pages/CartMobile"));
const Checkout = lazy(() => import("../pages/Checkout"));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess"));
const OrderCancel = lazy(() => import("../pages/OrderCancel"));

// Common loading component
const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
  </div>
);

// Reusable Suspense wrapper
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: withSuspense(Home),
      },
      {
        path: "search-page",
        element: withSuspense(Search),
      },
      {
        path: "my-account",
        element: withSuspense(UserMenuMobile),
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: withSuspense(Profile),
          },
          {
            path: "my-order",
            element: withSuspense(MyOrder),
          },
          {
            path: "address",
            element: withSuspense(Address),
          },
          {
            path: "products",
            element: (
              <AdminPermission>
                {withSuspense(ProductAdmin)}
              </AdminPermission>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminPermission>
                {withSuspense(UploadProduct)}
              </AdminPermission>
            ),
          },
          {
            path: "category",
            element: (
              <AdminPermission>
                {withSuspense(Category)}
              </AdminPermission>
            ),
          },
          {
            path: "sub-category",
            element: (
              <AdminPermission>
                {withSuspense(SubCategory)}
              </AdminPermission>
            ),
          },
        ],
      },
      {
        path: ":category/:sub-category",
        element: withSuspense(ProductListPage),
      },
      {
        path: "product/:productId",
        element: withSuspense(ProductDisplayPage),
      },
      {
        path: "cart",
        element: withSuspense(CartMobile),
      },
      {
        path: "checkout",
        element: withSuspense(Checkout),
      },
      {
        path: "order-success",
        element: withSuspense(OrderSuccess),
      },
      {
        path: "order-cancel",
        element: withSuspense(OrderCancel),
      },
    ],
  },
  {
    path: "/register",
    element: withSuspense(Register),
  },
  {
    path: "/login",
    element: withSuspense(Login),
  },
  {
    path: "/forgot-password",
    element: withSuspense(ForgotPassword),
  },
  {
    path: "/verify-otp",
    element: withSuspense(VerifyOtp),
  },
  {
    path: "/password-reset",
    element: withSuspense(PasswordResetForm),
  },
]);

export default router;
