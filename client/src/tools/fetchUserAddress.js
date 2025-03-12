import axiosSecure from "./axiosSecure";

export const fetchUserAddress = async() =>{
    try{
        const res= await axiosSecure.get('address/get-address');
        return res?.data?.address;
    }catch(e){
        console.error("Error fetching user details",e);
        throw new Error("Failed to fetch user details");

    }
}