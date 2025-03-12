import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import AddAddress from "../components/AddAddress"
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditAddress from "../components/EditAddress";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import axiosSecure from "../tools/axiosSecure";
import { fetchUserAddress } from "../tools/fetchUserAddress";
import { setAddressList } from "../store/addressSlice";
import toast from "react-hot-toast";
import { axiosToastError } from "../tools/axiosToastError";

const Address = () => {
    const addressList=useSelector((state)=>state?.address.addressList)
    const [openAddress,setOpenAddress]=useState(false)
    const [openEditAddress,setOpenEditAddress]=useState(false);
    const [openDeleteAddress,setOpenDeleteAddress]=useState(false)
    const [data,setData]=useState({})
    const dispatch=useDispatch()


    const confirm =async () => {
      try{
         const result= await axiosSecure.delete('address/delete-address',{data:{id:data?.id}})
         const userAddress= await fetchUserAddress()
             dispatch(setAddressList(userAddress))
         toast.success(result.data.message);
         setOpenDeleteAddress(false)

      }catch(e){
          axiosToastError(e)
      }
    }
  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg px-2 py-2">
        <h2 className="font-semibold">Address</h2>
      </div>
       <div className=" p-2 grid gap-4 bg-blue-50">
            {
              addressList?.map((address,index)=>{
                return (
                    <div key={index} className="border bg-white rounded p-3 flex justify-between gap-x-3 cursor-pointer" >
              

                    <div>
                    <p>{address?.address_line}</p>          
                    <p>{address?.city}</p>
                    <p>{address?.mobile}</p>
                    </div>

                    <div className="flex items-center  gap-x-3">
                      <button onClick={()=>{
                        setOpenEditAddress(true)
                        setData(address)
                      }} className="bg-primary-200 hover:text-secondary-200 text-white p-2 rounded"><MdEdit/></button>
                      
                      <button onClick={()=>{
                        setOpenDeleteAddress(true)
                        setData({id:address?._id})
                      }} className="bg-red-500 hover:text-secondary-200 text-white p-2 rounded"><MdDelete/></button>
                    </div>
                  </div>
                )
              })
            }
            <div onClick={()=>setOpenAddress(true)} className="h-16  cursor-pointer bg-blue-50 border-2 border-dashed flex justify-center items-center">
            <button className="flex items-center justify-center bg-primary-200 text-white p-2 rounded hover:text-secondary-200">Add Address</button>
          </div>

        
          </div>

           {
                  openAddress && <AddAddress close={()=>setOpenAddress(false)}/>       
                  
                }
                {
                   openEditAddress && <EditAddress address={data} close={()=>setOpenEditAddress(false)}/>
                }

                {
                  openDeleteAddress && <DeleteConfirmModal confirm={confirm} close={()=>setOpenDeleteAddress(false)}/>
                }
    </div>
  )
}

export default Address
