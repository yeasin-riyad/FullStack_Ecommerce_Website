
import { useCallback, useEffect, useState } from "react";

import { axiosToastError } from "../tools/axiosToastError";
import axiosSecure from "../tools/axiosSecure";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import NoData from "../components/NoData";

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products
  const getProducts = useCallback(async (signal) => {
    try {
      setLoading(true);

      const response = await axiosSecure.post(
        "product/get-all-products",
        {
          page,
          limit: 12,
          search: search.trim(),
        },
        { signal }
      );

      if (response?.data?.success) {
        setProducts(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      // Ignore cancelled requests
      if (!signal?.aborted) {
        axiosToastError(error);
        console.error(error);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [page, search]);

  // Fetch when page or search changes
  useEffect(() => {
    const controller = new AbortController();

    // Debounce search requests
    const delay = search.trim() ? 500 : 0;

    const timer = setTimeout(() => {
      getProducts(controller.signal);
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [getProducts, search]);

  // Pagination
  const handleNext = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handlePrevious = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  // Search handler
  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
    setPage(1);
  }, []);

  if (loading && products.length === 0) {
    return <Loading />;
  }

  return (
    <section>
      {/* Header */}
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-3">
        <h2 className="font-semibold whitespace-nowrap">
          Products:
        </h2>

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          className="border rounded focus-within:border-primary-200 p-2 w-full outline-none"
          placeholder="Search product..."
          aria-label="Search products"
        />
      </div>

      {/* Product List */}
      <div className="p-4 bg-blue-50">
        {loading && (
          <p className="text-sm text-gray-500 mb-3">
            Updating products...
          </p>
        )}

        {!loading && products.length === 0 ? (
          <NoData />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCardAdmin
                key={product._id}
                data={product}
                fetchProducts={getProducts}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center gap-3 mt-2">
          <button
            disabled={page === 1}
            onClick={handlePrevious}
            className="disabled:cursor-not-allowed disabled:bg-blue-50 border rounded border-primary-200 px-4 py-1 hover:bg-primary-200"
          >
            Previous
          </button>

          <button className="px-4 py-1 hover:bg-blue-100 rounded">
            {page}/{totalPages}
          </button>

          <button
            disabled={page >= totalPages}
            onClick={handleNext}
            className="disabled:cursor-not-allowed disabled:bg-blue-50 border rounded border-primary-200 px-8 py-1 hover:bg-primary-200"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductAdmin;
