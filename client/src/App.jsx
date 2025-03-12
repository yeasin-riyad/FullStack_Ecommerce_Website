import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { fetchUserDetails } from "./tools/fetchUserDetails";
import {  useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import { fetchCategories } from "./tools/fetchCategories";
import { setCategories, setLoadingCategories, setLoadingSubCategories, setProducts, setSubcategories } from "./store/productSlice";
import { fetchSubCategories } from "./tools/fetchSubCategories";
import { fetchAllProducts } from "./tools/fetchAllProducts";
import { fetchUserCartItems } from "./tools/fetchUserCartItems";
import { handleAddItemCart } from "./store/cartProduct";
import GlobalContextProvider from "./provider/GlobalContextProvider";
import CartItemsForMobile from "./components/CartItemsForMobile";
import { fetchUserAddress } from "./tools/fetchUserAddress";
import { setAddressList } from "./store/addressSlice";

function App() {
  const dispatch=useDispatch();
  const location=useLocation();

  const fetchUser=async() => {
    const user = await fetchUserDetails()
    dispatch(setUser(user))
  };

  const fetchCategoriesData=async()=>{
    try{
      dispatch(setLoadingCategories(true))
    const categories = await fetchCategories();
    dispatch(setCategories(categories));
    }catch(err){
      console.error(err)

    }finally{
      dispatch(setLoadingCategories(false))
    }

  }

  const fetchSubCategoriesData=async()=>{
    try{
      dispatch(setLoadingSubCategories(true))
      const subCategories = await fetchSubCategories();
    dispatch(setSubcategories(subCategories));
    }catch(err){
      console.error(err)
    }finally{
      dispatch(setLoadingSubCategories(false))
    }

  }

  const fetchAllProduct=async()=>{
    try{
      const products = await fetchAllProducts();
      dispatch(setProducts(products))
    }catch(err){
      console.error(err)
    }

  }

  const fetchAddress=async()=>{
    const userAddress= await fetchUserAddress()
    dispatch(setAddressList(userAddress))
  }



  useEffect(() => {
    fetchUser();
    fetchCategoriesData()
    fetchSubCategoriesData();
    fetchAllProduct();
    fetchAddress()
    // fetchCartItems();
  },[])
  return (
    <GlobalContextProvider>
    <Header/>
      <main className="">
        <Outlet />
      </main>
      <Footer/>
      {
        location.pathname !== "/checkout" && 
        <CartItemsForMobile/>

      }
    </GlobalContextProvider>
  );
}

export default App;
