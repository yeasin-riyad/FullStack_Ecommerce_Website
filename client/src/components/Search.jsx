import { useEffect, useState } from "react";
import { FaSearchengin } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { GoArrowLeft } from "react-icons/go";
import { useMobile } from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const isMobile = useMobile();
  const pathName = location.pathname.includes("/search-page");
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search");
  useEffect(() => {
    setIsSearchPage(location.pathname.includes("search-page"));
  }, [location]);

  const handleSearch = () => {
    navigate(`/search-page`);
  };
  const handleClick = () => {
    navigate("/");
  };

  const handleSearchValue = (e) => {
    const searchValue = e.target.value.toLowerCase();
    navigate(`/search-page?search=${searchValue}`);
  };

  return (
    <div className="flex items-center justify-start border-2 rounded-md py-2 px-3 border-primary-100 bg-slate-50 group">
      {isMobile && pathName ? (
        <button onClick={handleClick}>
          <GoArrowLeft
            size={22}
            className="text-secondary-200 group-focus-within:text-primary-200"
          />
        </button>
      ) : (
        <FaSearchengin
          onClick={handleSearch}
          size={22}
          className="text-secondary-200 group-focus-within:text-primary-200"
        />
      )}
      <div className="text-secondary-200 ml-3 w-full">
        {isSearchPage ? (
          <input
            type="text"
            placeholder="Search for products..."
            autoFocus
            value={searchTerm}
            onChange={handleSearchValue}
            className=" text-primary-200  outline-none  rounded-md px-4 w-full bg-slate-50"
          />
        ) : (
         <div onClick={handleSearch}>
           <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            'We produce food for Mice',
            1000, // wait 1s before replacing "Mice" with "Hamsters"
            'We produce food for Hamsters',
            1000,
            'We produce food for Guinea Pigs',
            1000,
            'We produce food for Chinchillas',
            1000
          ]}
          wrapper="span"
          speed={50}
          // style={{ fontSize: '2em', display: 'inline-block' }}
          repeat={Infinity}
        />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
