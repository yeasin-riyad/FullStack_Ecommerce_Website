import { useState } from "react";
import { IoIosCloseCircleOutline, IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axiosSecure from "../tools/axiosSecure";
import toast from "react-hot-toast";
import { axiosToastError } from "../tools/axiosToastError";
import { addSubCategory } from "../store/productSlice";

const UploadSubCategoryModal = ({ close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [subCategoryImages, setSubCategoryImages] = useState([]);
  const categories = useSelector((state) => state?.products.categories);
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
  });

  const handleCategoryChange = (e) => {
    if(!e.target.value) return
    const category = categories.find((c) => c._id === e.target.value);
    setData({
      ...data,
      category: [...data.category, category],
    });
  };


 const handleRemoveCategory = (categoryId) => {
  const index= data.category.findIndex( category => category._id === categoryId)
  if(index > -1) {
    data.category.splice(index, 1);
    setData({...data });
  }
 }
  const handleOnChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleUploadsubCategoryImage = (e) => {

    const files = Array.from(e.target.files);
    setData({ ...data, image: files });
    const urls = files.map((file) => URL.createObjectURL(file));
    setSubCategoryImages(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!data.name ||!data.image || data.category.length === 0){
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);

    const formData=new FormData();
    formData.append('name', data.name);
    data?.image?.forEach((img) => {
      formData.append('image', img);
    })
    data?.category?.forEach((cat) => {
      formData.append('category', cat?._id);
    })
   
    try{
      const response = await axiosSecure.post('subcategory/add-subcategory',formData);
      toast.success(response?.data?.message);
      dispatch(addSubCategory(response?.data?.data))
      console.log(response?.data?.data,"SubCategory......");
      close();
    }catch(e){
      axiosToastError(e);
    }finally{
      setLoading(false);
    };
  };

  return (
    <section className="fixed p-4 top-20 left-0 right-0 bottom-0 bg-neutral-800 bg-opacity-60 flex items-center justify-center">
      <div className="bg-white mt-2 w-full p-4 rounded max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Sub Category</h1>
          <button className="text-primary-200 block ml-auto" onClick={close}>
            <IoIosCloseCircleOutline size={23} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="my-3">
          <div className="grid gap-1">
            <label htmlFor="name">SubCategory Name:</label>
            <input
              className="bg-blue-50 outline-none rounded p-2 border border-primary-100 focus-within:border-primary-200"
              id="name"
              name="name"
              required
              value={data?.name}
              onChange={handleOnChange}
              type="text"
            />
          </div>

          {/* Image upload Section */}
          <div className="flex flex-col  gap-4 lg:flex-row items-center  ">
                {/* Display Uploaded Images */}
                <div className="flex flex-col items-start gap-2">
              <p>subCategory Image:</p>
              <div className="border rounded bg-blue-50 h-24 w-24 lg:h-36 lg:w-36 flex items-center justify-center overflow-hidden">
                {
                  subCategoryImages.map((url, index) => (
                      <img key={index}
                        src={url}
                        alt={`Subcategory Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                  ))
                }
            
              </div>
            </div>

            {/* Upload Button */}
            <label htmlFor="image">
              <div
                className={`p-2 mr-7 my-2 rounded cursor-pointer text-center ${
                  data?.name
                    ? "bg-primary-200 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Upload Image
              </div>
              <input
                type="file"
                className="hidden"
                id="image"
                name="image"
                multiple
                accept="image/*"
                onChange={handleUploadsubCategoryImage}
                disabled={!data.name}
                required
              />
            </label>
          </div>

          <div className="grid gap-1">
            <label htmlFor="category">Selecte Category:</label>
            {/* display value */}
            <p>
              {data?.category?.map((cat, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md mr-1"
                >
                  {cat.name}
                  <div onClick={()=>handleRemoveCategory(cat?._id)}>
                  <IoMdClose
                    size={18}
                    className="cursor-pointer text-red-500"
                  />
                  </div>
                </span>
              ))}
            </p>

            {/* select Value */}
            
            <select
            required
              name="category"
              onChange={handleCategoryChange}
              className="w-full lg:w-3/12 mb-2 outline-none bg-blue-50 rounded p-2 border border-primary-100 focus-within:border-primary-200"
              id="cars"
            >
              <option  value={""} >Select Category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !data.name || !data.image || !data.category.length}
            className={`w-full rounded p-2 text-white bg-primary-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "opacity-100 "
            }`}
          >
            {loading ? "Waiting" : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadSubCategoryModal;
