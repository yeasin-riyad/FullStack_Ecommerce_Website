import { memo, useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

import logo from "../assets/logo.png";

import Search from "./Search";
import UserMenu from "./UserMenu";
import DisplayCartItem from "./DisplayCartItem";

import { FaRegUserCircle } from "react-icons/fa";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { FaCartArrowDown } from "react-icons/fa";

import { useMobile } from "../hooks/useMobile";
import { displayPriceInTaka } from "../tools/displayPriceInTaka";
import { useGlobalContext } from "../provider/GlobalContextProvider";

const Header = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCartSection, setOpenCartSection] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();

  const user = useSelector((state) => state.user, shallowEqual);

  const { totalQnty, totalPrice, cartItems } = useGlobalContext();

  const isSearchPage = location.pathname.includes("/search-page");

  const handleMobileLogin = useCallback(() => {
    navigate(user?._id ? "/my-account" : "/login", {
      replace: true,
    });
  }, [user?._id, navigate]);

  const toggleUserMenu = useCallback(() => {
    setOpenUserMenu((prev) => !prev);
  }, []);

  const closeUserMenu = useCallback(() => {
    setOpenUserMenu(false);
  }, []);

  const openCart = useCallback(() => {
    setOpenCartSection(true);
  }, []);

  const closeCart = useCallback(() => {
    setOpenCartSection(false);
  }, []);

  const formattedTotalPrice = displayPriceInTaka(totalPrice);

  return (
    <header className="bg-white sticky h-32 lg:h-24 top-0 flex flex-col items-center justify-center lg:shadow-md z-50">

      {/* Main Header */}
      {!(isSearchPage && isMobile) && (
        <div className="py-4 px-4 container mx-auto flex justify-between items-center">

          {/* Logo */}
          <Link to="/" aria-label="Go to homepage">
            <img
              src={logo}
              width={170}
              height={60}
              alt="Logo"
              fetchPriority="high"
              className="hidden lg:block"
            />

            <img
              src={logo}
              width={120}
              height={60}
              alt="Logo"
              fetchPriority="high"
              className="lg:hidden"
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:block w-1/2">
            <Search />
          </div>

          {/* User and Cart */}
          <div className="flex items-center">

            {/* Mobile User */}
            <button
              className="block lg:hidden"
              onClick={handleMobileLogin}
              aria-label={user?._id ? "My account" : "Login"}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <FaRegUserCircle
                  size={24}
                  className="text-secondary-200"
                />
              )}
            </button>

            {/* Desktop Actions */}
            <div className="hidden gap-x-5 items-center justify-between lg:flex">

              {/* User Menu */}
              {user?._id ? (
                <div className="relative">

                  <button
                    type="button"
                    onClick={toggleUserMenu}
                    aria-expanded={openUserMenu}
                    aria-label="Toggle user menu"
                    className="select-none flex gap-x-1 items-center justify-center cursor-pointer"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <FaRegUserCircle
                        size={24}
                        className="text-primary-200"
                      />
                    )}

                    {openUserMenu ? (
                      <BiSolidUpArrow
                        size={12}
                        className="text-primary-200"
                      />
                    ) : (
                      <BiSolidDownArrow
                        size={12}
                        className="text-primary-200"
                      />
                    )}
                  </button>

                  {openUserMenu && (
                    <div className="absolute top-14 right-0">
                      <div className="bg-white rounded-md p-4 min-w-52 shadow-lg">
                        <UserMenu close={closeUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-primary-200 hover:bg-primary-100 text-secondary-100 p-2 rounded-md"
                >
                  Login
                </button>
              )}

              {/* Cart */}
              <button
                type="button"
                onClick={openCart}
                aria-label="Open shopping cart"
                className="flex text-sm cursor-pointer justify-between items-center gap-x-2 text-white bg-primary-200 p-2 rounded-md"
              >
                <FaCartArrowDown size={24} />

                {cartItems?.length > 0 ? (
                  <div className="font-bold">
                    <p>{totalQnty} Items</p>
                    <p>{formattedTotalPrice}</p>
                  </div>
                ) : (
                  <p>My Cart</p>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search */}
      <div className="container px-4 mx-auto block lg:hidden">
        <Search />
      </div>

      {/* Cart Modal */}
      {openCartSection && (
        <DisplayCartItem close={closeCart} />
      )}
    </header>
  );
};

export default memo(Header);