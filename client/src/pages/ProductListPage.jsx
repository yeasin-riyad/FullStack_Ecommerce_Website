import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosSecure from "../tools/axiosSecure";
import { axiosToastError } from "../tools/axiosToastError";
import CartProduct from "../components/CartProduct";
import { useSelector } from "react-redux";
import DisplaySubCatSkeleton from "../components/DisplaySubCatSkeleton";
import CardLoading from "../components/CardLoading";
import NoData from "../components/NoData";
import { validUrlConvert } from "../tools/validUrlConvert";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [sortby, setSortBy] = useState();
  const [displaySubCategory, setDisplaySubCategory] = useState([]);
  const params = useParams();
  const subCategories = useSelector((state) => state?.products.subCategories);
  const subCategoryLoading = useSelector(
    (state) => state?.products.loadingSubCategories
  );
  const categoryId = params.category.split("-").slice(-1)[0];
  const subcategoryId = params["sub-category"].split("-").slice(-1)[0];
  const subcategoryName = params["sub-category"]
    .split("-")
    .slice(0, -1)
    .filter(Boolean)
    .join(",");
  const fetchProductByCategoryIdSubcategoryId = async () => {
    try {
      setLoading(true);

      const response = await axiosSecure.post(
        "/product/get-product-by-category-and-subcategory",
        {
          categoryId: categoryId,
          subcategoryId: subcategoryId,
          searchTerm: searchTerm,
          page: page,
          limit: limit,
          sortby: sortby,
        }
      );
      setData(response?.data?.data);
      setTotalPages(response?.data?.totalPages);
    } catch (e) {
      axiosToastError(e);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductByCategoryIdSubcategoryId();
  }, [params]);

  // console.log(subcategoryId, "Id.")
  useEffect(() => {
    const specificSubcategories = subCategories?.filter((subCat) => {
      return subCat?.category.some((cat) => {
        return cat?._id === categoryId;
      });
    });
    setDisplaySubCategory(specificSubcategories);
  }, [categoryId, subCategories]);

  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/* subCategory */}
        <div className=" min-h-[79vh] max-h-[79vh]  shadow-md overflow-y-scroll   scrollbarCustom">
          {displaySubCategory?.map((subCat, index) => {
            const url= `/${validUrlConvert(subCat?.category[0]?.name)}-${subCat?.category[0]._id}/${validUrlConvert(subCat?.name)}-${subCat?._id}`;
            return (
              <Link to={url}
                className={`w-full ${
                  subCat?._id === subcategoryId
                    ? "bg-primary-200 text-white  font-semibold"
                    : "bg-white"
                }   p-2 flex flex-col  border border-b items-center justify-center lg:flex-row  lg:items-center lg:justify-start hover:cursor-pointer hover:bg-primary-100`}
                key={index}
              >
                <div className="w-fit flex items-center justify-center  lg:ml-2">
                  <img
                    className="w-14  object-scale-down h-full lg:h-14"
                    src={subCat?.image}
                    alt="subCategoryImg"
                  />
                </div>
                <p className="-mt-5 text-xs lg:text-sm text-center lg:text-left ">
                  {subCat?.name}
                </p>
              </Link>
            );
          })}

          <div className=" min-h-[79vh] max-h-[79vh] shadow-md overflow-y-scroll animate-pulse   scrollbarCustom">
            {subCategoryLoading && <DisplaySubCatSkeleton />}
          </div>
        </div>

        {/* Product */}
        <div className=" min-h-[79vh] max-h-[79vh] shadow-md overflow-y-scroll ">
          <div className="bg-white shadow-md p-2 fixed w-full z-50 ">
            <h3 className="font-semibold">{subcategoryName}</h3>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 mt-6">
              {data?.map((p, index) => {
                return <CartProduct key={index} data={p} />;
              })}

              {loading &&
                new Array(6)
                  .fill(null)
                  .map((_, index) => <CardLoading key={index} />)}
            </div>
          </div>

          {!data?.length > 0 && <NoData text={`in ${subcategoryName}`} />}
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
