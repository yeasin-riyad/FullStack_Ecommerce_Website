import { useState } from "react";
import UploadCategoryModal from "../components/UploadCategoryModal";
import NoData from "../components/NoData";
import EditCategoryModal from "../components/EditCategoryModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axiosSecure from "../tools/axiosSecure";
import toast from "react-hot-toast";
import { removeCategory } from "../store/productSlice";
import { axiosToastError } from "../tools/axiosToastError";

const Category = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  // const [categories, setCategories] = useState([]);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({});
  const [deleteCategory, setDeleteCategory] = useState(null);

  // const fetchCategories = async () => {
  //   try {
  //     setLoadCategory(true);
  //     const response = await axiosSecure.get("category/get-category");
  //     setCategories(response?.data?.data);
  //     console.log(response?.data?.data, "Data....Data....");
  //     // console.log(`http://localhost:8000/${response?.data?.data?.image.replace(/\\/g, "/")}`,"Image............")
  //   } catch (err) {
  //     axiosToastError(err);
  //   } finally {
  //     setLoadCategory(false);
  //   }
  // };

  const categories = useSelector((state) => state?.products.categories);

  const dispatch = useDispatch()
  const confirm=async()=>{
     try{
      const response = await axiosSecure.delete('category/delete-category', {
          data: { categoryId:deleteCategory } 
      });
             if(response.data.success){
      toast.success(response?.data?.message)
      dispatch(removeCategory(deleteCategory));
      
      setDeleteCategory(false)
     }
     }catch(err){
      axiosToastError(err)
      
     }finally{
      setDeleteCategory(false)
     }
  }
  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm hover:text-white border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded"
        >
          Add Category
        </button>
      </div>

      {categories?.length <= 0 && (
        <div>
          <NoData />
        </div>
      )}
      <div className="grid p-4 gap-2 gap-y-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {categories?.map((category, index) => (
          <div key={index} className=" w-40 rounded shadow-md">
            <img
              src={category?.image} // Backend serves this
              alt={category?.name}
              className="w-full object-scale-down"
            />

            <div className="px-1 gap-1  h-9 flex justify-between items-center ">
              <button
                onClick={() => {
                  setOpenEditCategory(true);
                  setCurrentCategory(category);
                }}
                className="text-sm flex-1   mx-auto  hover:text-white border border-primary-200 hover:bg-primary-200  px-3 py-1 rounded"
              >
                <FaEdit className="mx-auto" />
              </button>

              <button
                onClick={() => {
                  setDeleteCategory(category?._id);
                }}
                className="ml-2 flex-1 text-sm hover:text-white border border-red-500 hover:bg-red-500  px-3 py-1 rounded"
                >
                <MdDelete  className="mx-auto"/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteCategory && (
        <DeleteConfirmModal
         confirm={confirm}
          close={() => setDeleteCategory(false)}
        />
      )}

      {openEditCategory && (
        <EditCategoryModal
          category={currentCategory}
          close={() => setOpenEditCategory(false)}
        />
      )}

      {openUploadCategory && (
        <UploadCategoryModal close={() => setOpenUploadCategory(false)} />
      )}
    </section>
  );
};

export default Category;
