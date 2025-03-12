import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import AddNewField from "../components/AddNewField";
import { axiosToastError } from "../tools/axiosToastError";
import toast from "react-hot-toast";
import axiosSecure from "../tools/axiosSecure";

const UploadProduct = () => {
  const [productUploading,setProductUploading] =useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [viewFullImage, setViewFullImage] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const categories = useSelector((state) => state?.products.categories);
  const subCategories = useSelector((state) => state?.products.subCategories);
  
   const [openNewField,setOpenNewField] = useState(false)
   const [newFieldName,setNewFieldName]=useState("");
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [], 
    subCategory: [],
    unit: "",
    stock: 0,
    price: 0,
    discount: 0,
    description: "",
    product_details:"",
    more_details: {},
    publish: true,
  });
  const handleProductImages = (e) => {
    const files = Array.from(e.target.files);
    setData({ ...data, image: files });
    const urls = files.map((file) => URL.createObjectURL(file));
    setProductImages(urls);
  };
  const handleSaveProduct= async(e) => {
    e.preventDefault();
    try{
      setProductUploading(true);
     

        // Validate the form inputs here. For example, check if the name field is not empty. Also, check if all required fields are filled.
        if(!data?.name || data?.image.length===0 || data?.category.length===0 
          || data?.subCategory.length===0 || !data?.unit || !data?.stock || !data?.price || !data?.description) {
            return toast.error("All Fields are required")
          }
        
          // Create a form data object to send the product image along with the other form data.
        const formData = new FormData();
        formData.append("name",data?.name);
        formData.append("description",data?.description);
        formData.append("product_details",data?.product_details);
        data?.image.forEach(img => formData.append('image',img))
        data?.category?.forEach(c => formData.append('category',c?._id));
        data?.subCategory?.forEach(sc => formData.append('subCategory',sc?._id));
        formData.append("unit",data?.unit);
        formData.append("stock",data?.stock);
        formData.append("price",data?.price);
        formData.append("discount",data?.discount);
        formData.append("more_details", JSON.stringify(data?.more_details));
        formData.append("publish",data?.publish);
        // Send the form data to the server
        const result = await axiosSecure.post('product/add-product', formData)
        toast.success(result?.data?.message)
        setData({
          name: "",
          image: [],
          category: [], 
          subCategory: [],
          unit: "",
          stock: 0,
          price: 0,
          discount: 0,
          description: "",
          product_details:"",
          more_details: {},
          publish: true,
        })
      
    
    }catch(e){
      axiosToastError(e)
    }finally{
      setProductUploading(false);
    }
    // Add your logic here to save the product to the database
  }

  const handleRemoveCategory = (index) => {
    setData({
      ...data,
      category: data.category.filter((category,i) => index !== i) // ✅ নতুন অ্যারে তৈরি হচ্ছে
    });
  };
  
  const handleRemoveSubCategory = (index) => {
    setData({
     ...data,
      subCategory: data.subCategory.filter((category, i) => index!== i) // ✅ নতুন অ্যারে ত��রি হ��্ছে
    });
  }




  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);
  
    if (selectedCategory) {
      setData((prevData) => {
        // আগের ক্যাটাগরির মধ্যে এই ক্যাটাগরি আছে কিনা চেক করা হচ্ছে
        const isAlreadySelected = prevData.category.some(cat => cat._id === selectedCategoryId);
        
        if (!isAlreadySelected) {
          return {
            ...prevData,
            category: [...prevData.category, selectedCategory] // আগের ক্যাটাগরি রেখে নতুনটি যোগ করা হচ্ছে
          };
        }
        return prevData; // যদি ডুপ্লিকেট হয়, তাহলে আগের ডেটা ফেরত দেওয়া হচ্ছে
      });
    }
  }; 
  

 
  const handleSubCategoryChange = (e) => {
    if (!e.target.value) return;
  
    const newSubCategory = subCategories.find((sc) => sc._id === e.target.value);
  
    setData((prevData) => {
      const isAlreadySelected = prevData.subCategory.some(sc => sc._id === newSubCategory._id);
  
      if (!isAlreadySelected) {
        return {
          ...prevData,
          subCategory: [...prevData.subCategory, newSubCategory]
        };
      }
      
      return prevData; // If duplicate, return the previous state
    });
  };
  

  const handleNewFieldName=(e) => {
    e.preventDefault();

    setData({...data,more_details:{...data.more_details,[newFieldName]:""}})
    setNewFieldName("")
    setOpenNewField(false)
  };

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Upload Product:-</h2>
      
      </div>
      <div>
        <form onSubmit={handleSaveProduct} className="grid gap-2 px-2">
          <div className="grid gap-1">
            <label htmlFor="name" className="font-semibold">Name:-</label>
            <input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              placeholder="Enter Product Name"
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="description">Description:-</label>
            <textarea
              id="description"
              type="text"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              required
              rows={3}
              placeholder="Enter Product Description"
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100 rounded resize-none"
            />
          </div>

          {/* Product Details */}
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="product_details">Product Details :-</label>
            <textarea
              id="product_details"
              type="text"
              value={data.product_details}
              onChange={(e) =>
                setData({ ...data, product_details:e.target.value })
              }
              required
              rows={5}
              placeholder="Enter Product Details..."
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100 rounded resize-none"
            />
          </div>



          <div>
            <div>
              <p className="font-semibold">Image:-</p>
              <label
                htmlFor="productImage"
                className="bg-blue-50 h-24 border rounded flex items-center justify-center cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center">
                  <FaCloudUploadAlt size={35} />
                  <p>Upload Image</p>
                  <input
                    onChange={handleProductImages}
                    multiple
                    type="file"
                    name="productImage"
                    id="productImage"
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </label>
            </div>

            {/* Display Uploaded Images */}
            <div className="flex flex-wrap gap-2 md:gap-4">
              {productImages.map((url, index) => (
                <div
                  className="w-20 mt-1 h-20 min-w-20 bg-blue-50 border relative group flex"
                  key={index}
                >
                    <img
                      onClick={() => {
                        setViewFullImage(true);
                        setImgUrl(url);
                      }}
                      src={url}
                      alt="Product Image"
                      width="100"
                      className="cursor-pointer "
                    />
                    <button
                      className="absolute bottom-0 right-0 bg-red-500 text-white rounded p-1 hidden group-hover:block"
                      onClick={() =>{
                        setProductImages(
                          productImages.filter((_, i) => i !== index)
                        )
                        const newImages=data?.image?.filter((_, i) =>i !== index)
                        setData({
                         ...data,
                          image:newImages,
                        })
                      }
                        

                      }
                    >
                      <MdDelete />
                    </button>
                </div>
              ))}
            </div>

           
          </div>

          <div className="grid gap-1 mt-2"> 
              <label className="font-semibold" htmlFor="category">Select Category:-</label>
              <select
                id="category"
                required
                onChange={handleCategoryChange}
                className="bg-blue-50 border w-full p-2 focus-within:border-primary-100 rounded outline-none"
                >
                  <option value="">Select Category</option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}

                  </select>

             
              {/* display value */}
                        <p>
                          {data?.category?.map((cat, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md mr-1"
                            >
                              {cat.name}
                              <div onClick={()=>handleRemoveCategory(index)}>
                              <IoMdClose
                                size={18}
                                className="cursor-pointer text-red-500"
                              />
                              </div>
                            </span>
                          ))}
                        </p>
            </div>

          <div className="grid gap-1">

            {/* Select subCategory */}
          <label className="font-semibold" htmlFor="subcategory">Select subCategory:-</label>
          <select
                id="subcategory"
                onChange={handleSubCategoryChange}
                required
                className="bg-blue-50 border w-full p-2 focus-within:border-primary-100 rounded outline-none"
                >
                  <option value="">Select subCategory</option>
                  {subCategories?.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </option>
                  ))}

                  </select>

                  {/* display Subcategory values */}
                  <p>
                    {data?.subCategory?.map((subcat, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md mr-1"
                      >
                        {subcat.name}
                        <div onClick={()=>handleRemoveSubCategory(index)}>
                          <IoMdClose
                            size={18}
                            className="cursor-pointer text-red-500"
                          />
                        </div>
                      </span>
                    ))}
                  </p>

          </div>
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="unit">Unit:-</label>
            <input
              id="unit"
              type="text"
              value={data.unit}
              onChange={(e) => setData({ ...data, unit: e.target.value })}
              required
              placeholder="Enter Product Unit"
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="stock">Stock:-</label>
            <input
              id="stock"
              type="Number"
              value={data.stock}
              onChange={(e) => setData({ ...data, stock: e.target.value })}
              required
              placeholder="Enter Product Stock Number"
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="price">Price:-</label>
            <input
              id="price"
              type="Number"
              value={data.price}
              onChange={(e) => setData({ ...data, price: e.target.value })}
              required
              placeholder="Enter Product Price"
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="discount">Discount:-</label>
            <input
              id="discount"
              type="Number"
              value={data.discount}
              onChange={(e) => setData({ ...data, discount: e.target.value })}
              required
              placeholder="Enter Product Discount"
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100 rounded"
            />
          </div>
          <div className="grid gap-1">
            {
              Object.keys(data?.more_details).map(key =>{
                return (
                  <div className="grid gap-1" key={key}>
                    <label className="font-semibold" htmlFor={key}>{key}:-</label>
                    <input
                      id={key}
                      type="text"
                      value={data.more_details[key]}
                      onChange={(e) => setData({...data, more_details: {...data.more_details, [key]: e.target.value }})}
                      required
                      placeholder={`Enter Product ${key}`}
                      className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100 rounded"
                    />
                  </div>
                )
              })
            }
          
          </div>
          {/* Add more Fields */}
          <div disabled={productUploading} onClick={()=>setOpenNewField(true)} className=" bg-primary-200 cursor-pointer disabled:cursor-not-allowed  hover:text-white hover:font-semibold py-1 px-3 w-36 rounded text-center ">
            Add More Fields
          </div>
          <button disabled={productUploading }  type="submit" className="mt-4 w-full bg-primary-200 hover:text-white font-semibold py-2 px-4 rounded disabled:cursor-not-allowed">
            Save Product
          </button>
        </form>
        {openNewField && (
          <AddNewField
          newFieldName={newFieldName}
          setNewFieldName={setNewFieldName}
          handleNewFieldName={handleNewFieldName}
          close={() => setOpenNewField(false)}
            
            />)}
        {viewFullImage && (
          <ViewImage imgUrl={imgUrl} close={() => setViewFullImage(false)} />
        )}
      </div>
    </section>
  );
};

export default UploadProduct;
