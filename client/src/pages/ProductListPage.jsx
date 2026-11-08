
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axiosSecure from "../tools/axiosSecure";
import { axiosToastError } from "../tools/axiosToastError";

import CartProduct from "../components/CartProduct";
import DisplaySubCatSkeleton from "../components/DisplaySubCatSkeleton";
import CardLoading from "../components/CardLoading";
import NoData from "../components/NoData";

import { validUrlConvert } from "../tools/validUrlConvert";

const SKELETON_ITEMS = Array.from({ length: 6 });

const ProductListPage = () => {
  // -----------------------------
  // 1. Local States
  // -----------------------------

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [sortby, setSortBy] = useState();

  // -----------------------------
  // 2. URL Parameters
  // -----------------------------

  const { category, "sub-category": subCategory } = useParams();

  const categoryId = useMemo(
    () => category?.split("-").pop(),
    [category]
  );

  const subcategoryId = useMemo(
    () => subCategory?.split("-").pop(),
    [subCategory]
  );

  const subcategoryName = useMemo(
    () =>
      subCategory
        ?.split("-")
        .slice(0, -1)
        .filter(Boolean)
        .join(" "),
    [subCategory]
  );

  // -----------------------------
  // 3. Redux State
  // -----------------------------

  const subCategories = useSelector(
    (state) => state.products.subCategories
  );

  const subCategoryLoading = useSelector(
    (state) => state.products.loadingSubCategories
  );

  // -----------------------------
  // 4. Filter Subcategories
  // -----------------------------

  const displaySubCategory = useMemo(() => {
    return subCategories?.filter((subCat) =>
      subCat?.category?.some(
        (cat) => cat?._id === categoryId
      )
    ) || [];
  }, [subCategories, categoryId]);

  // -----------------------------
  // 5. Fetch Products
  // -----------------------------

  const fetchProducts = useCallback(
    async (signal) => {
      if (!categoryId || !subcategoryId) return;

      try {
        setLoading(true);

        const response = await axiosSecure.post(
          "/product/get-product-by-category-and-subcategory",
          {
            categoryId,
            subcategoryId,
            searchTerm,
            page,
            limit,
            sortby,
          },
          { signal }
        );

        setData(response?.data?.data || []);
        setTotalPages(response?.data?.totalPages || 1);

      } catch (error) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return;
        }

        axiosToastError(error);
        console.error("Product fetching error:", error);

        setData([]);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [
      categoryId,
      subcategoryId,
      searchTerm,
      page,
      limit,
      sortby,
    ]
  );

  // -----------------------------
  // 6. Fetch API on Dependency Change
  // -----------------------------

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  // -----------------------------
  // 7. Reset Pagination on Filter Change
  // -----------------------------

  useEffect(() => {
    setPage(1);
  }, [categoryId, subcategoryId, searchTerm, limit, sortby]);

  // -----------------------------
  // 8. Generate Subcategory URL
  // -----------------------------

  const getSubcategoryUrl = (subCat) => {
    const categoryName = validUrlConvert(
      subCat?.category?.[0]?.name
    );

    const subcategoryName = validUrlConvert(subCat?.name);

    return `/${categoryName}-${subCat?.category?.[0]?._id}/${subcategoryName}-${subCat?._id}`;
  };

  // -----------------------------
  // 9. Render UI
  // -----------------------------

  return (
    <section className="sticky top-24 lg:top-20">

      <div className="container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">

        {/* =========================
            Subcategory Sidebar
        ========================= */}

        <aside className="min-h-[79vh] max-h-[79vh] shadow-md overflow-y-auto scrollbarCustom">

          {subCategoryLoading ? (
            <DisplaySubCatSkeleton />
          ) : (
            displaySubCategory.map((subCat) => (
              <Link
                key={subCat._id}
                to={getSubcategoryUrl(subCat)}
                className={`w-full p-2 flex flex-col border border-b items-center justify-center lg:flex-row lg:justify-start hover:bg-primary-100 ${
                  subCat?._id === subcategoryId
                    ? "bg-primary-200 text-white font-semibold"
                    : "bg-white"
                }`}
              >
                <div className="w-fit flex items-center justify-center lg:ml-2">
                  <img
                    className="w-14 h-14 object-scale-down"
                    src={subCat?.image}
                    alt={subCat?.name || "Subcategory"}
                    loading="lazy"
                  />
                </div>

                <p className="text-xs lg:text-sm text-center lg:text-left">
                  {subCat?.name}
                </p>
              </Link>
            ))
          )}

        </aside>

        {/* =========================
            Product Section
        ========================= */}

        <main className="min-h-[79vh] max-h-[79vh] shadow-md overflow-y-auto">

          {/* Header */}

          <div className="bg-white shadow-md p-2 sticky top-0 z-40">
            <h3 className="font-semibold">
              {subcategoryName}
            </h3>
          </div>

          {/* Products */}

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4">

            {data.map((product) => (
              <CartProduct
                key={product._id}
                data={product}
              />
            ))}

            {loading &&
              SKELETON_ITEMS.map((_, index) => (
                <CardLoading key={index} />
              ))}

          </div>

          {/* Empty State */}

          {!loading && data.length === 0 && (
            <NoData text={`in ${subcategoryName}`} />
          )}

          {/* Pagination */}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 p-4">

              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 bg-primary-100 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span>
                {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-primary-100 rounded disabled:opacity-50"
              >
                Next
              </button>

            </div>
          )}

        </main>

      </div>

    </section>
  );
};

export default memo(ProductListPage);
