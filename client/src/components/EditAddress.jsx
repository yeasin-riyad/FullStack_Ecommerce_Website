
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form"
import { axiosToastError } from "../tools/axiosToastError";
import axiosSecure from "../tools/axiosSecure";
import toast from "react-hot-toast";
import { fetchUserAddress } from "../tools/fetchUserAddress";
import { setAddressList } from "../store/addressSlice";
import { useDispatch } from "react-redux";

const EditAddress = ({address,close}) => {
    const dispatch=useDispatch()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm({
        defaultValues:{
            address_line:address?.address_line,
        city:address?.city,
        mobile:address?.mobile
        },

      })

      const onSubmit =async (data) => {
        try{
           const result= await axiosSecure.post('address/edit-address',{...data,id:address?._id})
           const userAddress= await fetchUserAddress()
               dispatch(setAddressList(userAddress))
           toast.success(result.data.message);

           reset()
           close()
        }catch(e){
            axiosToastError(e)
        }
      }

  return (
    <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70'>
        <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
            <div className="flex justify-between items-center">
                <h2 className="font-semibold">Edit Address:</h2>
                <IoMdClose size={24} className="cursor-pointer"  onClick={()=>close()}/>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
                <div className="grid gap-1">
                    <label >Address Line :</label>
                    <input {...register("address_line",{required:true})} type="text"  className="border bg-blue-50 p-2 rounded" placeholder="Enter address line"/>

                </div>


                <div className="grid gap-1">
                    <label >City :</label>
                    <input {...register("city",{required:true})} type="text"  className="border bg-blue-50 p-2 rounded" placeholder="Enter Your City"/>

                </div>

                <div className="grid gap-1">
                    <label >Mobile No :</label>
                    <input {...register("mobile",{required:true,maxLength:11,minLength:11})} type="number"  className="border bg-blue-50 p-2 rounded" placeholder="Enter Your Mobile No"/>

                </div>

                <button type="submit" className="bg-primary-200 w-full text-white p-1 rounded hover:bg-green-600">Submit</button>
            </form>

        </div>
      
    </section>
  )
}

export default EditAddress
