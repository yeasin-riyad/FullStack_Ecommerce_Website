import axiosSecure from "./axiosSecure"
import { axiosToastError } from "./axiosToastError";

export const fetchSubCategories =async()=>{
    try{
        const response= await axiosSecure.get('subcategory/get-subcategories');
        // toast.success(response?.data?.message);
        return response?.data?.data;
        

    }catch(e){
        axiosToastError(e);
    }
}