
import  { useEffect, useRef, useState } from "react";
import CardLoading from "../components/CardLoading";
import { axiosToastError } from "../tools/axiosToastError";
import axiosSecure from "../tools/axiosSecure";
import CartProduct from "../components/CartProduct";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "../components/NoData";

const Search = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  // Track the previous search term
  const activeSearchRef = useRef(searchTerm);

  // Prevent multiple simultaneous requests
  const fetchingRef = useRef(false);

  useEffect(() => {
    // Search term changed: reset pagination and old results
    if (activeSearchRef.current !== searchTerm) {
      activeSearchRef.current = searchTerm;

      setData([]);
      setTotalPages(1);

      if (page !== 1) {
        setPage(1);
        return;
      }
    }

    const controller = new AbortController();

    // Initial page and search requests
    if (page === 1) {
      setLoading(true);
      setLoadingMore(false);
    } else {
      setLoadingMore(true);
    }

    fetchingRef.current = true;

    const fetchProducts = async () => {
      try {
        const response = await axiosSecure.post(
          "product/get-all-products",
          {
            page,
            limit: 20,
            search: searchTerm,
          },
          {
            signal: controller.signal,
          }
        );

        if (response?.data?.success) {
          const products = response.data.data || [];

          setData((prevData) =>
            page === 1 ? products : [...prevData, ...products]
          );

          setTotalPages(response.data.totalPages || 0);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          axiosToastError(err);
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
          fetchingRef.current = false;
        }
      }
    };

    // Debounce search requests only
    const delay = page === 1 && searchTerm ? 300 : 0;

    const timer = setTimeout(fetchProducts, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
      fetchingRef.current = false;
    };
  }, [searchTerm, page]);

  // Load next page
  const handleNext = () => {
    if (
      !fetchingRef.current &&
      !loading &&
      !loadingMore &&
      page < totalPages
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const hasMore =
    data.length === 0 ? loading : page < totalPages;

  return (
    <section className="bg-white p-4">
      <div className="container mx-auto p-4">
        <h2 className="font-semibold">
          Search Result for: {searchTerm}
        </h2>

        <p className="font-semibold">
          Search Result: {data.length}
        </p>

        <InfiniteScroll
          dataLength={data.length}
          next={handleNext}
          hasMore={hasMore}
          loader={
            loadingMore && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
                {Array.from({ length: 5 }, (_, index) => (
                  <CardLoading key={index} />
                ))}
              </div>
            )
          }
          endMessage={
            !loading && (
              <div className="text-center mt-4">
                {data.length === 0 ? (
                  <NoData text="No products found for this search" />
                ) : (
                  <p className="text-gray-500">
                    You have viewed all products.
                  </p>
                )}
              </div>
            )
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Initial loading skeletons */}
            {loading &&
              data.length === 0 &&
              Array.from({ length: 20 }, (_, index) => (
                <CardLoading key={index} />
              ))}

            {/* Product list */}
            {data.map((product) => (
              <CartProduct
                key={product._id}
                data={product}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </section>
  );
};

export default Search;
