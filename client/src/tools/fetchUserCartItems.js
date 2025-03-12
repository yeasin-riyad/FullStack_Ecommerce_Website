import axiosSecure from "./axiosSecure"

export const fetchUserCartItems=async()=>{
    try{
        const response=await axiosSecure.get('cart/get-cart-items');
        return response?.data?.data;
    }catch(err){
        // axiosToastError(err)
        console.error(err);
    }
}