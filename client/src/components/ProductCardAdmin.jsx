import { useState } from "react"
import EditProductModal from "./EditProductModal"
import DeleteConfirmModal from "./DeleteConfirmModal"
import { axiosToastError } from "../tools/axiosToastError"
import toast from "react-hot-toast"
import axiosSecure from "../tools/axiosSecure"

const ProductCardAdmin = ({data,fetchProducts}) => {
  const [modalOpen,setModalOpen]=useState(false)
  const [openConfirmModal,setOpenConfirmModal]=useState(false)


  const confirm=async()=>{
    try{
     const response = await axiosSecure.delete('product/delete-product', {
         data: { productId:data?._id } 
     });
            if(response.data.success){
     toast.success(response?.data?.message)
     fetchProducts()
    //  dispatch(removeSubCategory(selectedSubCategoryId));
     
     setOpenConfirmModal(false)
    }
    }catch(err){
     axiosToastError(err)
     
    }finally{
     setOpenConfirmModal(false)
    }
 }

  return (
    <div className='w-36 p-4 bg-white rounded'>
      <div>
        <img src={data?.image[0]} alt={data?.name} className='w-full h-full object-scale-down' />
      </div>
      <p className='text-ellipsis line-clamp-2 font-medium'>{data?.name}</p>
      <p className='text-slate-500'>{data?.unit}</p>
      <div className='flex justify-between items-center'> 
        <button onClick={()=>setModalOpen(true)} className='border px-2 py-1 text-sm border-primary-200 hover:bg-primary-200 hover:text-white rounded'>Edit</button>
        <button onClick={()=>setOpenConfirmModal(true)} className='border px-2 py-1 text-sm border-red-500 hover:bg-red-500 hover:text-white rounded'>Delete</button>
      </div>
      {modalOpen && <EditProductModal data={data} onClose={()=>setModalOpen(false)} fetchProducts={fetchProducts}/>}
      {openConfirmModal && <DeleteConfirmModal confirm={confirm} close={()=>setOpenConfirmModal(false)} fetchProducts={fetchProducts}/>}

    </div>
  )
}

export default ProductCardAdmin
