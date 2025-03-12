import React, { useEffect, useState } from "react";
import CardLoading from "../components/CardLoading";
import { axiosToastError } from "../tools/axiosToastError";
import axiosSecure from "../tools/axiosSecure";
import { debounce } from "lodash";
import CartProduct from "../components/CartProduct";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "../components/NoData";

const Search = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const loadingArrayCard = new Array(20).fill(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search");

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.post("product/get-all-products", {
        page,
        limit: 20,
        search: searchTerm,
      });
      if (response?.data?.success) {

        // toast.success(response?.data.message)
        setData((prevData) =>
          page === 1 ? response?.data?.data : [...prevData, ...response?.data?.data]
        );
        
        setTotalPages(response?.data?.totalPages);
      }
    } catch (err) {
      axiosToastError(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (searchTerm) {
      setPage(1);
      const delaySearch = debounce(() => {
        getProducts();
      }, 300);
      delaySearch();
      return () => {
        delaySearch.cancel();
      };
    } else {
      getProducts(); // when search is empty get all products again
    }
  }, [searchTerm,page]);
  return (
    <section className="bg-white p-4">
      <div className="container mx-auto p-4">
        <h2 className="font-semibold">Search Result for: {searchTerm}</h2>
        <p className="font-semibold">Search Result: {data?.length}</p>

        <InfiniteScroll
              dataLength={data?.length}
              next={() => {
                setPage(page + 1);
               
              }}
              hasMore={page < totalPages}
              loader={
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {new Array(5).fill(null).map((_, index) => (
                    <CardLoading key={index} />
                  ))}
                </div>
              }
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <NoData text={"For this search"}/>
                </p>
              }
            >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Loading Data */}
            {loading &&
              loadingArrayCard.map((_, index) => <CardLoading key={index} />)}

            {/* Show Data */}
          
              {data?.map((product, index) => (
                <div key={index}>
                  <CartProduct data={product} />
                </div>
              ))}
          </div>
        </InfiniteScroll>
      </div>
    </section>
  );
};

export default Search;
