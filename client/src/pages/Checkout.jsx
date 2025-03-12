import React, { useState } from "react";
import { displayPriceInTaka } from "../tools/displayPriceInTaka";
import { useGlobalContext } from "../provider/GlobalContextProvider";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import axiosSecure from "../tools/axiosSecure";
import { axiosToastError } from "../tools/axiosToastError";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js'
import { fetchOrderData } from "../tools/fetchOrderData";

const Checkout = () => {
  const [selectedAddress,setSelectedAddress]=useState(false)
  const addressList=useSelector((state)=>state?.address.addressList)
  const myCartItems = useSelector((state)=>state?.cartItem.cart)
  const navigate=useNavigate()

  const {
    totalPriceWithoutDiscount,
    totalPrice,
    cartItems,
    fetchCartItems,
    totalQnty,
  } = useGlobalContext();
  const [openAddress,setOpenAddress]=useState(false);

  const handleCashOnDelivery=async ()=>{
    try{
      // toast.loading("Loading...")
      const data={
        list_items:myCartItems,
        totalAmt:totalPrice,
        addressId:addressList[selectedAddress]?._id,
        subTotalAmt:totalPrice
      }
      const response= await axiosSecure.post('/order/cash-on-delivery',data)
      if(response?.data.success){
        toast.success(response.data.message)
        navigate('/order-success',{
          state:{
            text:"Order"
          }
        })
        fetchCartItems()
        fetchOrderData()

      }
    }catch(e){
      axiosToastError(e)
    }
 
  }

  const handleOnlinePayment= async ()=>{
    try{
      const stripe_public_key=import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const stripePromise= await loadStripe(stripe_public_key)
      const data={
        list_items:myCartItems,
        totalAmt:totalPrice,
        addressId:addressList[selectedAddress]?._id,
        subTotalAmt:totalPrice
      }
      const response= await axiosSecure.post('/order/checkout',data)
      if(response){
        // toast.success(response.data.message)
        // navigate('/order-success',{
        //   state:{
        //     text:"Order"
        //   }
        // })
        stripePromise.redirectToCheckout({sessionId:response?.id})
        console.log(response,"Resp.....")
        fetchCartItems()

      }
    }catch(e){
      axiosToastError(e)
    }
  }
  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-5 justify-between">
        <div className="w-full">
          {/* address */}
          <h1 className="text-lg font-semibold">Choose Your Address</h1>
          <div className="bg-white p-2 grid gap-4">
            {
              addressList?.map((address,index)=>{
                return (
                  <label htmlFor={index} key={index}>
                    <div className="border rounded p-3 flex gap-x-3 hover:bg-blue-50 cursor-pointer" >
                    <div>
                      <input id={index} type="radio" name="address" value={index} onChange={(e)=>setSelectedAddress(e.target.value)}/>

                    </div>

                    <div>
                    <p>{address?.address_line}</p>          
                    <p>{address?.city}</p>
                    <p>{address?.mobile}</p>
                    </div>
                  </div>
                  </label>
                )
              })
            }
            <div onClick={()=>setOpenAddress(true)} className="h-16  cursor-pointer bg-blue-50 border-2 border-dashed flex justify-center items-center">
            Add Address
          </div>
          </div>
          
        </div>

        <div className="my-2 w-full max-w-md bg-white p-4">
          {/* Summary */}
          <h1 className="text-lg font-semibold">Review and Checkout</h1>
          <div className="bg-white ">
            {/* <h3 className="font-semibold">Bill Details</h3> */}
            <div className="flex gap-4 justify-between">
              <p>Items Total:</p>
              <p className="flex gap-2 items-center">
                <span className="line-through text-neutral-400">
                  {displayPriceInTaka(totalPriceWithoutDiscount)}
                </span>
                <span>{displayPriceInTaka(totalPrice)}</span>
              </p>
            </div>

            <div className="flex gap-4 my-1 justify-between">
              <p>Total Quantity:</p>
              <p className="flex gap-2 items-center">{totalQnty}</p>
            </div>
            <div className="flex gap-4 my-1 justify-between">
              <p>Delivery Charge:</p>
              <p className="flex gap-2 items-center">Free</p>
            </div>

            <div className="font-semibold flex gap-2 items-center justify-between">
              <p>Grand Total:</p>
              <p className="">{displayPriceInTaka(totalPrice)}</p>
            </div>
          </div>
          <div className="w-full my-4  gap-4 flex flex-col">
            <button onClick={handleOnlinePayment}  disabled={!selectedAddress} className={`py-2 px-4 bg-primary-200 text-white font-semibold rounded hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-900 disabled:border-gray-200`}>Online Payment</button>
            <button onClick={handleCashOnDelivery} disabled={!selectedAddress} className={`py-2 px-4 border border-primary-200 rounded font-semibold text-primary-200 hover:bg-primary-200 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-900 disabled:border-gray-200`}>Cash On Delivery</button>
          </div>
        </div>
      </div>

      {
        openAddress && <AddAddress close={()=>setOpenAddress(false)}/>
      }
    </section>
  );
};

export default Checkout;
