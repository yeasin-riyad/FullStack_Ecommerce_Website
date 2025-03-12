import  { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axiosSecure from "../tools/axiosSecure";
import toast from "react-hot-toast";
import { axiosToastError } from "../tools/axiosToastError";
import { useDispatch } from "react-redux";
import { addCategory } from "../store/productSlice";

const UploadCategoryModal = ({ close }) => {
  const dispatch=useDispatch()
  const [data, setData] = useState({
    name: "",
    image: "",
    imagePreview: null,
  });
  const [loading,setLoading] = useState(false)

  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleUploadCategoryImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({
        ...data,
        image: file,
        imagePreview: URL.createObjectURL(file), // Create a preview URL
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true) // Show loading spinner while the category is being created
  
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.image); // Append the file
  
    try {
      const res = await axiosSecure.post("category/add-category", formData, {
        // headers: {
        //   "Content-Type": "multipart/form-data", // Required for file uploads
        // },
      });
      toast.success(res?.data?.message);
      dispatch(addCategory(res?.data?.data))
      close(); // Close the modal when the category is created successfully

    } catch (error) {
      console.log(error)
      axiosToastError(error);
    }finally {
      setLoading(false) // Hide loading spinner when the request is finished
    }
  };
  

  return (
    <section className="fixed p-4 top-20 lg:top-9 left-0 right-0 bottom-0 bg-neutral-800 bg-opacity-60 flex items-center justify-center">
      <div className="bg-white w-full p-4 rounded max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Category</h1>
          <button className="text-primary-200 block ml-auto" onClick={close}>
            <IoIosCloseCircleOutline size={23} />
          </button>
        </div>
        
        <form className="my-3" onSubmit={handleSubmit}>
          {/* Category Name Input */}
          <div className="grid gap-1">
            <label htmlFor="name">Category Name:</label>
            <input
              className="bg-blue-50 outline-none rounded p-2 border border-primary-100 focus-within:border-primary-200"
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col gap-4 lg:flex-row items-center mt-3">
            <div className="flex flex-col items-start gap-2">
              <p>Category Image:</p>
              <div className="border rounded bg-blue-50 h-24 w-24 lg:h-36 lg:w-36 flex items-center justify-center overflow-hidden">
                {data.imagePreview ? (
                  <img
                    src={data.imagePreview}
                    alt="Category Image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <label htmlFor="image">
              <div
                className={`p-2 rounded cursor-pointer text-center ${
                  data.name ? "bg-primary-200 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Upload Image
              </div>
              <input
                type="file"
                className="hidden"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleUploadCategoryImage}
                disabled={!data.name} // Disable input when name is empty
                required
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 disabled:cursor-not-allowed bg-primary-200 text-white px-4 py-2 rounded"
            disabled={!data.name || !data.image || loading }// Disable if name or image is missing
          >
            {loading ? "Waiting......." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModal;
