import axiosSecure from "./axiosSecure"
import { axiosToastError } from "./axiosToastError";

export const fetchOrderData =async()=>{
    try{
        const response= await axiosSecure.get('order/get-order');
        // toast.success(response?.data?.message);
        return response?.data?.data;
        

    }catch(e){
        axiosToastError(e);
    }
}