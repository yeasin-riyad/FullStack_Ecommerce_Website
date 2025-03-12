import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosSecure from "../tools/axiosSecure";
import { axiosToastError } from "../tools/axiosToastError";
import { displayPriceInTaka } from "../tools/displayPriceInTaka";
import Divider from "../components/Divider";
import img1 from "../assets/minute_delivery.png";
import img2 from "../assets/Best_Prices_Offers.png";
import img3 from "../assets/Wide_Assortment.png";
import { priceAfterDiscount } from "../tools/priceAfterDiscount";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalContextProvider";
import { BsPlus } from "react-icons/bs";
import { LuMinus } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
const ProductDisplayPage = () => {
  const { fetchCartItems } = useGlobalContext();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    discount: 0,
    image: [],
    category: "",
  });
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const navigate=useNavigate()
  const params = useParams();
  const productId = params?.productId?.split("-")?.slice(-1)[0];
    const user=useSelector((state)=>state?.user._id)
  
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.post("product/get-product-details", {
        productId,
      });

      setProduct(response?.data?.data);
    } catch (e) {
      axiosToastError(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      if(!user){
        return navigate("/login")
      }
      const response = await axiosSecure.post("cart/add-to-cart", {
        product_id: product?._id,
        quantity,
      });
      fetchCartItems();
      toast.success(response.data.message);
    } catch (e) {
      axiosToastError(e);
    }
  };
  const moveRight = ()=>{
    containerRef.current.scrollLeft+=50

}
const moveLeft = ()=>{
    containerRef.current.scrollLeft-=50
}

  if (loading) return <p>Loading...</p>;
  return (
    <section className="container mx-auto grid grid-cols-1  lg:grid-cols-2 px-4">
      <div className="">
        <div className=" rounded h-[30vh] mx-auto lg:h-[55vh] w-full  p-2 bg-white">
          <img
            src={product?.image[imageIndex]}
            alt={product?.name}
            className="w-full h-full object-scale-down"
          />
        </div>
        <div className="flex items-center justify-center gap-2 p-2 bg-white">
          {product?.image.map((img, index) => {
            return (
              <div
                onClick={() => setImageIndex(index)}
                key={index}
                className={`w-3 h-3 lg:w-5 lg:h-5 cursor-pointer rounded-full ${
                  index == imageIndex ? "bg-primary-200" : "bg-primary-100"
                }`}
              />
            );
          })}
        </div>
        <div className="flex items-center  mx-auto gap-2  ">
          <div className="hidden lg:block rounded-full border border-primary-200">
          <IoIosArrowBack  onClick={moveLeft} size={23} />


          </div>

          <div ref={containerRef} className="flex mr-6  overflow-x-auto lg:overflow-x-hidden w-full gap-x-2 mt-2 items-center px-5">
            {product?.image?.map((img, index) => {
              return (
                <img 
                
                  onClick={() => setImageIndex(index)}
                  key={index}
                  src={img}
                  alt="Product Image"
                  className={`w-20 h-20 border rounded-md  object-scale-down shadow cursor-pointer ${index== imageIndex ?'border-primary-200 ':""}`}
                />
              );
            })}
          </div>
          <div className="hidden lg:block rounded-full border border-primary-200">
          <IoIosArrowForward onClick={moveRight} size={23} />

            </div>

        </div>

        <div className="my-4 hidden lg:grid gap-3 ">
          <div>
            <p className="font-semibold">Product Details</p>
            <p className="text-base line-clamp-5">{product?.product_details}</p>
          </div>
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{product?.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p className="text-base">{product?.unit}</p>
          </div>
          <div>
            {product?.more_details &&
              Object.keys(product.more_details).map((key, index) => {
                return (
                  <div className="my-2" key={index}>
                    <p className="font-semibold">{key}</p>
                    <p className="text-base">{product.more_details[key]}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="p-4 lg:pl-7 text-base lg:text-lg">
        <p className="bg-green-300 w-fit px-2 rounded-full">10 min</p>
        <h2 className="text-lg font-semibold lg:text-3xl">{product?.name}</h2>
        <p className="">{product?.unit}</p>
        <Divider />
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 my-4">
          <p className="">Price</p>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="border border-primary-200 px-4 py-2 rounded bg-green-199 w-fit">
              <p className="font-semibold text-lg lg:text-xl">
                {displayPriceInTaka(
                  priceAfterDiscount(product?.price, product?.discount)
                )}
              </p>
            </div>

            <p className="line-through">
              {Boolean(product?.discount) && displayPriceInTaka(product?.price)}
            </p>

            {Boolean(product?.discount) && (
              <p className="font-bold text-primary-200 lg:text-2xl">
                {product?.discount}%{" "}
                <span className="text-base text-neutral-500">discount</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 my-4">
          <p>Quantity</p>
          <div className="border border-primary-200 px-4 py-2 rounded bg-green-199 w-fit">
            <p className="font-semibold text-lg lg:text-xl flex gap-x-4 items-center">
              <button
                onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
              >
                <LuMinus />
              </button>{" "}
              {quantity}{" "}
              <button
                onClick={() =>
                  setQuantity((prev) =>
                    prev !== product?.quantity ? prev + 1 : prev
                  )
                }
              >
                <BsPlus />
              </button>
            </p>
          </div>
        </div>
        {product?.stock === 0 ? (
          <button className="text-lg text-red-500 my-2">Out Of Stock</button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="my-4 px-4 py-1 bg-primary-200 text-white rounded "
          >
            Add To Cart
          </button>
        )}
        {/* for desktop */}
        <div className="my-4 grid lg:hidden gap-3 ">
          <div>
            <p className="font-semibold">Product Details</p>
            <p className="text-base line-clamp-5">{product?.product_details}</p>
          </div>
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{product?.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p className="text-base">{product?.unit}</p>
          </div>
          <div>
            {product?.more_details &&
              Object.keys(product.more_details).map((key, index) => {
                return (
                  <div className="my-2" key={index}>
                    <p className="font-semibold">{key}</p>
                    <p className="text-base">{product.more_details[key]}</p>
                  </div>
                );
              })}
          </div>
        </div>
        <h2 className="font-semibold">Why shop from nextbuy?</h2>
        <div className="flex items-center gap-4 my-4">
          <img src={img1} alt="superfast delivery" className="h-20 w-20" />
          <div className="text-sm">
            <div className="font-semibold">Superfast Delivery</div>
            <div>
              Get your order delivered to your doorstep at the earliest from
              dark stores near you.{" "}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 my-4">
          <img src={img2} alt="best price offers" className="h-20 w-20" />
          <div className="text-sm">
            <div className="font-semibold">Best Prices & Offers</div>
            <div>
              Best Price destination with offers directly from the
              manufacturers.{" "}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 my-4">
          <img src={img3} alt="best price offers" className="h-20 w-20" />
          <div className="text-sm">
            <div className="font-semibold">Wide Assortment</div>
            <div>
              Choose from 5000+ products accross food personal care,household &
              other categories.{" "}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
