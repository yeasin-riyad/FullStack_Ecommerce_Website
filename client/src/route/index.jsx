import {
    createBrowserRouter,
    
  } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Register from "../pages/Register";
import Login from "../pages/login";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import PasswordResetForm from "../pages/PasswordResetForm";
import UserMenuMobile from "../pages/UserMenuMobile";
import MyOrder from "../pages/MyOrder";
import Dashboard from "../layout/Dashboard";
import Profile from "../pages/Profile";
import Address from "../pages/Address";
import UploadProduct from "../pages/UploadProduct";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermission from "../components/AdminPermission";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/orderSuccess";
import OrderCancel from "../pages/orderCancel";
  
  
  
  
  const router = createBrowserRouter([
      {
        path: "/",
        element: <App/>,
        children: [
          {
            index: true,
            element:<Home/>,
          },
          {
            path:"/search-page",
            element:<Search/>
          },
          {
            path:"/my-account",
            element:<UserMenuMobile/>
          },
         
          {
            path:"/dashboard",
            element:<Dashboard/>,
            children:[
              {
                path:'profile',
                element:<Profile/>
              },
              {
                path:'my-order',
                element:<MyOrder/>
              },
              {
                path:'address',
                element:<Address/>
              },
              {
                path:'products',
                element:<AdminPermission><ProductAdmin/></AdminPermission>
              },
              {
                path:"upload-product",
                element:<AdminPermission><UploadProduct/></AdminPermission>
              },
              {
                path:'category',
                element:<AdminPermission><Category/></AdminPermission>
              },
              {
                path:'sub-category',
                element:<AdminPermission><SubCategory/></AdminPermission>
              }
            ]
          },
          {
            path:"/:category",
            children: [
              {
                path:":sub-category",
                element:<ProductListPage/>
              }
            ],
          },
          {
            path:"/product/:productId",
            element:<ProductDisplayPage/> 
          },
          {
            path:"cart",
            element:<CartMobile/>
          },
          {
            path:"checkout",
            element:<Checkout/>
          },
          {
            path:"order-success",
            element:<OrderSuccess/>
          },
          {
            path:"order-cancel",
            element:<OrderCancel/>
          }
        ]
      },
      {
        path:"/register",
        element:<Register/>
      },
      {
        path:"/login",
        element:<Login/>
      },
    {
      path:"forgot-password",
      element:<ForgotPassword/>
    },
    {
      path:"verify-otp",
      element:<VerifyOtp/>
    },
    {
      path:"password-reset",
      element:<PasswordResetForm/>
    }

    ]);
  
    export default router;
  
  