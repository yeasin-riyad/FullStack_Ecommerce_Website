import  {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axiosSecure from "../tools/axiosSecure";
import CardLoading from "./CardLoading";
import CartProduct from "./CartProduct";

import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

import { validUrlConvert } from "../tools/validUrlConvert";

const SKELETON_ITEMS = Array.from({ length: 6 }, (_, index) => index);

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

  const subCategories = useSelector(
    (state) => state.products.subCategories
  );

  const navigate = useNavigate();

  // Fetch products only when category ID changes
  useEffect(() => {
    let isMounted = true;

    const fetchProductByCategoryId = async () => {
      try {
        setLoading(true);

        const response = await axiosSecure.post(
          "/product/get-product-by-id",
          { categoryId: id }
        );

        if (isMounted) {
          setProducts(response?.data?.data ?? []);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch category products:", error);
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductByCategoryId();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Memoized navigation handler
  const handleRedirectProductListPage = useCallback(() => {
    const subCategory = subCategories?.find((subC) =>
      subC?.category?.some((category) => category._id === id)
    );

    if (!subCategory) return;

    const url = `/${validUrlConvert(name)}-${id}/${validUrlConvert(
      subCategory.name
    )}-${subCategory._id}`;

    navigate(url);
  }, [id, name, subCategories, navigate]);

  // Scroll handlers
  const moveRight = useCallback(() => {
    containerRef.current?.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  }, []);

  const moveLeft = useCallback(() => {
    containerRef.current?.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  }, []);

  return (
    <section>
      {/* Category Header */}
      <div className="container mx-auto p-4 flex items-start justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">
          {name}
        </h3>

        <button
          onClick={handleRedirectProductListPage}
          className="text-primary-200 hover:text-primary-100"
        >
          See All
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid px-4 grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-8">
          {SKELETON_ITEMS.map((index) => (
            <CardLoading key={index} />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {!loading && products.length > 0 && (
        <div className="px-4 gap-3 my-1 hidden lg:flex justify-end">
          <button
            onClick={moveLeft}
            aria-label="Scroll products left"
            className="hover:scale-125 duration-200 text-primary-200 rounded-full"
          >
            <IoIosArrowDropleftCircle size={25} />
          </button>

          <button
            onClick={moveRight}
            aria-label="Scroll products right"
            className="hover:scale-125 duration-200 text-primary-200 rounded-full"
          >
            <IoIosArrowDroprightCircle size={25} />
          </button>
        </div>
      )}

      {/* Products */}
      {!loading && products.length > 0 && (
        <div
          ref={containerRef}
          className="flex gap-3 lg:gap-5 px-6 overflow-x-auto lg:overflow-hidden scroll-smooth items-center"
        >
          {products.map((product) => (
            <CartProduct
              data={product}
              key={product._id}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default memo(CategoryWiseProductDisplay);