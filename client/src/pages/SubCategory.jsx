import { useState } from "react";
import UploadSubCategoryModal from "../components/UploadSubCategoryModal";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import DisplayTable from "../components/DisplayTable";
import ViewImage from "../components/ViewImage";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import EditSubCategoryModal from "../components/EditSubCategoryModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import axiosSecure from "../tools/axiosSecure";
import toast from "react-hot-toast";
import { removeSubCategory } from "../store/productSlice";
import { axiosToastError } from "../tools/axiosToastError";

const SubCategory = () => {
  const [openConfirmModal,setOpenConfirmModal]=useState(false)
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(false);
  const [openUploadSubCategory, setOpenUploadSubCategory] = useState(false);
  const [updateSubCategoryModal,setUpdateSubCategoryModal] = useState(false);
  const [imageUrl,setImageUrl] = useState("");
  const subCategories = useSelector((state) => state?.products.subCategories);

  const dispatch = useDispatch()
  const confirm=async()=>{
     try{
      const response = await axiosSecure.delete('subcategory/delete-subcategories', {
          data: { subcategoryId:selectedSubCategoryId } 
      });
             if(response.data.success){
      toast.success(response?.data?.message)
      dispatch(removeSubCategory(selectedSubCategoryId));
      
      setOpenConfirmModal(false)
     }
     }catch(err){
      axiosToastError(err)
      
     }finally{
      setOpenConfirmModal(false)
     }
  }
  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <div>
            {
              row.original?.image?.map((singleUrl) =>{
                return <img onClick={()=>setImageUrl(singleUrl)} key={singleUrl} src={singleUrl} alt={row.original.name} className="w-12 h-12 object-cover rounded-md cursor-pointer" />
              })
            }
          </div>
          {/* <img
            src={row.original.image}
            alt={row.original.name}
            className="w-12 h-12 object-cover rounded-md cursor-pointer"
            onClick={() => setImageUrl(row.original.image)}
          /> */}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) =>
        row.original.category.map((cat) => cat.name).join(", "), // ক্যাটাগরি লিস্ট দেখানো
    },
    {
      accessorKey: "_id",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <button
            onClick={() => setUpdateSubCategoryModal(row?.original)}
            className="text-sm hover:text-white border border-primary-200 hover:bg-primary-200  px-3 py-1 rounded"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              setOpenConfirmModal(true);
              setSelectedSubCategoryId(row?.original._id);
            }}
            className="ml-2 text-sm hover:text-white border border-red-500 hover:bg-red-500  px-3 py-1 rounded"
          >
            <MdDelete />
          </button>
        </div>
      ),
    }
    // {
    //   accessorKey: "createdAt",
    //   header: "Created At",
    //   cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    // },
  ];

  return (
    <section >
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenUploadSubCategory(true)}
          className="text-sm hover:text-white border border-primary-200 hover:bg-primary-200  px-3 py-1 rounded"
        >
          Add SubCategory
        </button>
      </div>

      {subCategories?.length <= 0 && (
        <div>
          <NoData />
        </div>
      )}
     
     {openConfirmModal && <DeleteConfirmModal confirm={confirm} close={()=>setOpenConfirmModal(false)}/>}

      {updateSubCategoryModal && <EditSubCategoryModal singleSubCategory={updateSubCategoryModal} close={()=>setUpdateSubCategoryModal(false)}/>}

      {imageUrl &&  <ViewImage imgUrl={imageUrl} close={()=>setImageUrl("")}/>}

      {subCategories?.length > 0 && (
        <div className="overflow-auto max-w-[96vw] w-full">
          <DisplayTable data={subCategories} columns={columns} />
        </div>
      )}

      {openUploadSubCategory && (
        <UploadSubCategoryModal close={() => setOpenUploadSubCategory(false)} />
      )}
    </section>
  );
};

export default SubCategory;
