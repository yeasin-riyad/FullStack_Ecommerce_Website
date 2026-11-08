
export const axiosToastError=(error)=>{
    // toast.error(error?.response?.data?.message || error.message);
    console.error(error?.response?.data?.message || error.message)

}