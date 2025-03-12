import axiosPublic from "./axiosPublic";
import { axiosToastError } from "./axiosToastError";

export const fetchAllProducts=async()=>{
    try{
        const products=await axiosPublic.post('product/get-all-products')
        return products?.data?.data;
    }catch(e){
        axiosToastError(e)
    }
}