
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axiosSecure from "../tools/axiosSecure";
import { axiosToastError } from "../tools/axiosToastError";
import { displayPriceInTaka } from "../tools/displayPriceInTaka";
import { priceAfterDiscount } from "../tools/priceAfterDiscount";

import Divider from "../components/Divider";

import img1 from "../assets/minute_delivery.png";
import img2 from "../assets/Best_Prices_Offers.png";
import img3 from "../assets/Wide_Assortment.png";

import toast from "react-hot-toast";

import { useGlobalContext } from "../provider/GlobalContextProvider";

import { BsPlus } from "react-icons/bs";
import { LuMinus } from "react-icons/lu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Static data outside component
const SHOP_BENEFITS = [
  {
    image: img1,
    title: "Superfast Delivery",
    description:
      "Get your order delivered to your doorstep at the earliest from dark stores near you.",
  },
  {
    image: img2,
    title: "Best Prices & Offers",
    description:
      "Best Price destination with offers directly from the manufacturers.",
  },
  {
    image: img3,
    title: "Wide Assortment",
    description:
      "Choose from 5000+ products across food personal care, household & other categories.",
  },
];

const INITIAL_PRODUCT = {
  name: "",
  description: "",
  product_details: "",
  price: 0,
  discount: 0,
  image: [],
  category: "",
  quantity: 0,
  stock: 0,
  more_details: {},
};

const ProductDisplayPage = () => {
  // ---------------------------------
  // 1. Hooks and Global State
  // ---------------------------------

  const navigate = useNavigate();
  const { productId: productSlug } = useParams();

  const { fetchCartItems } = useGlobalContext();

  const user = useSelector((state) => state.user?._id);

  const productId = useMemo(
    () => productSlug?.split("-").pop(),
    [productSlug]
  );

  // ---------------------------------
  // 2. Local State
  // ---------------------------------

  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const containerRef = useRef(null);

  // ---------------------------------
  // 3. Fetch Product Details
  // ---------------------------------

  const fetchProductDetails = useCallback(
    async (signal) => {
      if (!productId) return;

      try {
        setLoading(true);

        const response = await axiosSecure.post(
          "product/get-product-details",
          { productId },
          { signal }
        );

        const productData = response?.data?.data;

        setProduct(productData || INITIAL_PRODUCT);
        setImageIndex(0);
        setQuantity(1);

      } catch (error) {
        if (
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED"
        ) {
          return;
        }

        axiosToastError(error);
        console.error("Product details error:", error);

      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [productId]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchProductDetails(controller.signal);

    return () => controller.abort();
  }, [fetchProductDetails]);

  // ---------------------------------
  // 4. Memoized Product Values
  // ---------------------------------

  const images = useMemo(
    () => product?.image || [],
    [product?.image]
  );

  const finalPrice = useMemo(
    () => priceAfterDiscount(product?.price, product?.discount),
    [product?.price, product?.discount]
  );

  const formattedPrice = useMemo(
    () => displayPriceInTaka(finalPrice),
    [finalPrice]
  );

  const formattedOriginalPrice = useMemo(
    () => displayPriceInTaka(product?.price),
    [product?.price]
  );

  const isOutOfStock = product?.stock <= 0;

  // ---------------------------------
  // 5. Image Gallery
  // ---------------------------------

  const handleImageChange = useCallback((index) => {
    setImageIndex(index);
  }, []);

  const moveRight = useCallback(() => {
    containerRef.current?.scrollBy({
      left: 100,
      behavior: "smooth",
    });
  }, []);

  const moveLeft = useCallback(() => {
    containerRef.current?.scrollBy({
      left: -100,
      behavior: "smooth",
    });
  }, []);

  // ---------------------------------
  // 6. Quantity Management
  // ---------------------------------

  const decreaseQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const increaseQuantity = useCallback(() => {
    setQuantity((prev) =>
      Math.min(product?.quantity || 0, prev + 1)
    );
  }, [product?.quantity]);

  // ---------------------------------
  // 7. Add Product to Cart
  // ---------------------------------

  const handleAddToCart = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isOutOfStock || addingToCart) return;

    try {
      setAddingToCart(true);

      const response = await axiosSecure.post(
        "cart/add-to-cart",
        {
          product_id: product?._id,
          quantity,
        }
      );

      await fetchCartItems();

      toast.success(response?.data?.message);

    } catch (error) {
      axiosToastError(error);
      console.error("Add to cart error:", error);

    } finally {
      setAddingToCart(false);
    }
  }, [
    user,
    navigate,
    isOutOfStock,
    addingToCart,
    product?._id,
    quantity,
    fetchCartItems,
  ]);

  // ---------------------------------
  // 8. Product Information Component
  // ---------------------------------

  const ProductInformation = (
    <div className="grid gap-3 my-4">
      <div>
        <p className="font-semibold">Product Details</p>
        <p className="text-base line-clamp-5">
          {product?.product_details}
        </p>
      </div>

      <div>
        <p className="font-semibold">Description</p>
        <p className="text-base">{product?.description}</p>
      </div>

      <div>
        <p className="font-semibold">Unit</p>
        <p className="text-base">{product?.unit}</p>
      </div>

      {Object.entries(product?.more_details || {}).map(
        ([key, value]) => (
          <div className="my-2" key={key}>
            <p className="font-semibold">{key}</p>
            <p className="text-base">{value}</p>
          </div>
        )
      )}
    </div>
  );

  // ---------------------------------
  // 9. Loading State
  // ---------------------------------

  if (loading) {
    return (
      <section className="container mx-auto p-4">
        <p>Loading product...</p>
      </section>
    );
  }

  // ---------------------------------
  // 10. Main UI
  // ---------------------------------

  if (!product?._id) {
    return (
      <section className="container mx-auto p-4">
        <p>Product not found.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto grid grid-cols-1 lg:grid-cols-2 px-4">

      {/* =========================
          Product Images
      ========================= */}

      <div>

        {/* Main Image */}

        <div className="rounded h-[30vh] mx-auto lg:h-[55vh] w-full p-2 bg-white">

          <img
            src={images[imageIndex] || images[0]}
            alt={product?.name}
            className="w-full h-full object-scale-down"
            fetchPriority="high"
          />

        </div>

        {/* Image Indicators */}

        <div className="flex items-center justify-center gap-2 p-2 bg-white">

          {images.map((img, index) => (
            <button
              type="button"
              key={img || index}
              onClick={() => handleImageChange(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === imageIndex}
              className={`w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                index === imageIndex
                  ? "bg-primary-200"
                  : "bg-primary-100"
              }`}
            />
          ))}

        </div>

        {/* Thumbnail Gallery */}

        <div className="flex items-center mx-auto gap-2">

          <button
            type="button"
            onClick={moveLeft}
            className="hidden lg:block rounded-full border border-primary-200"
            aria-label="Scroll images left"
          >
            <IoIosArrowBack size={23} />
          </button>

          <div
            ref={containerRef}
            className="flex mr-6 overflow-x-auto lg:overflow-x-hidden w-full gap-x-2 mt-2 items-center px-5"
          >

            {images.map((img, index) => (
              <button
                type="button"
                key={img || index}
                onClick={() => handleImageChange(index)}
                aria-label={`Select image ${index + 1}`}
                className={`w-20 h-20 flex-shrink-0 border rounded-md shadow ${
                  index === imageIndex
                    ? "border-primary-200"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={img}
                  alt={`${product?.name} ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-scale-down"
                />
              </button>
            ))}

          </div>

          <button
            type="button"
            onClick={moveRight}
            className="hidden lg:block rounded-full border border-primary-200"
            aria-label="Scroll images right"
          >
            <IoIosArrowForward size={23} />
          </button>

        </div>

        {/* Desktop Product Information */}

        <div className="hidden lg:block">
          {ProductInformation}
        </div>

      </div>

      {/* =========================
          Product Details & Cart
      ========================= */}

      <div className="p-4 lg:pl-7 text-base lg:text-lg">

        <p className="bg-green-300 w-fit px-2 rounded-full">
          10 min
        </p>

        <h2 className="text-lg font-semibold lg:text-3xl">
          {product?.name}
        </h2>

        <p>{product?.unit}</p>

        <Divider />

        {/* Price */}

        <div className="flex flex-col lg:flex-row lg:items-center gap-3 my-4">

          <p>Price</p>

          <div className="flex items-center gap-2 lg:gap-4">

            <div className="border border-primary-200 px-4 py-2 rounded bg-green-199 w-fit">
              <p className="font-semibold text-lg lg:text-xl">
                {formattedPrice}
              </p>
            </div>

            {Boolean(product?.discount) && (
              <>
                <p className="line-through">
                  {formattedOriginalPrice}
                </p>

                <p className="font-bold text-primary-200 lg:text-2xl">
                  {product?.discount}%
                  <span className="text-base text-neutral-500">
                    {" "}discount
                  </span>
                </p>
              </>
            )}

          </div>

        </div>

        {/* Quantity */}

        <div className="flex flex-col lg:flex-row lg:items-center gap-3 my-4">

          <p>Quantity</p>

          <div className="border border-primary-200 px-4 py-2 rounded bg-green-199 w-fit">

            <div className="font-semibold text-lg lg:text-xl flex gap-x-4 items-center">

              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <LuMinus />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= (product?.quantity || 0)}
                aria-label="Increase quantity"
              >
                <BsPlus />
              </button>

            </div>

          </div>

        </div>

        {/* Add to Cart */}

        {isOutOfStock ? (
          <button
            disabled
            className="text-lg text-red-500 my-2"
          >
            Out Of Stock
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="my-4 px-4 py-1 bg-primary-200 text-white rounded disabled:opacity-50"
          >
            {addingToCart ? "Adding..." : "Add To Cart"}
          </button>
        )}

        {/* Mobile Product Information */}

        <div className="lg:hidden">
          {ProductInformation}
        </div>

        {/* Shopping Benefits */}

        <h2 className="font-semibold">
          Why shop from nextbuy?
        </h2>

        {SHOP_BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="flex items-center gap-4 my-4"
          >

            <img
              src={benefit.image}
              alt={benefit.title}
              className="h-20 w-20"
              loading="lazy"
            />

            <div className="text-sm">

              <div className="font-semibold">
                {benefit.title}
              </div>

              <div>{benefit.description}</div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default memo(ProductDisplayPage);
