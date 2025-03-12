import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { useMobile } from "../hooks/useMobile";
import { FaCartArrowDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useState } from "react";
import UserMenu from "./UserMenu";
import { displayPriceInTaka } from "../tools/displayPriceInTaka";
import { useGlobalContext } from "../provider/GlobalContextProvider";
import DisplayCartItem from "./DisplayCartItem";
const Header = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCartSection,setOpenCartSection] = useState(false);
  const location = useLocation();
  const isMobile = useMobile();
  const pathName = location.pathname.includes("/search-page");
  const user = useSelector((state) => state?.user);
  const {totalQnty,totalPrice,cartItems}=useGlobalContext()
  console.log(user, "My User");

  const navigate = useNavigate();



  const handleMobileLogin = () => {
    if(!(user?._id)){
      navigate("/login", { replace: true }); 
      return   
    }else{
      navigate("/my-account", { replace: true });
      return
    }
  };
  

  return (
    <header className="bg-white sticky h-32 lg:h-24 top-0 flex flex-col items-center justify-center lg:shadow-md z-50">
      {!(pathName && isMobile) && (
        <div className="py-4  px-4 container mx-auto flex justify-between items-center">
          {/* logo */}

          <Link to={"/"}>
            <img
              width={170}
              height={60}
              src={logo}
              alt="logo"
              className="hidden lg:block"
            />
            <img
              width={120}
              height={60}
              src={logo}
              alt="logo"
              className="lg:hidden"
            />
          </Link>

          {/* Search */}
          <div className="hidden lg:block w-1/2">
            <Search />
          </div>

          {/* Login and My Cart */}
          <div className="flex items-center">
            {/* Login */}
            {/* For Mobile */}
            <div className="flex gap-3">
            <button className="block lg:hidden" onClick={handleMobileLogin}>
           
           {user?.avatar ? (
                       <img className="w-10 h-10 rounded-full" src={user.avatar} />
                     ) : (
                       <FaRegUserCircle
                         size={24}
                         className="text-secondary-200"
                       />
                     )}
         
           
           </button>
          
            </div>

            {/* For Desktop */}

            <div className="hidden gap-x-5 items-center justify-between lg:flex">
              {user?._id ? (
                <div className="relative">
                  <div>
                    <div
                      onClick={() =>
                        setOpenUserMenu((openUserMenu) => !openUserMenu)
                      }
                      className="select-none flex gap-x-1 items-center justify-center  cursor-pointer"
                    >
                      {user?.avatar ? (
                        <img className="w-10 h-10 rounded-full" src={user.avatar} />
                      ) : (
                        <FaRegUserCircle
                          size={24}
                          className="text-primary-200"
                        />
                      )}
                      {!openUserMenu ? (
                        <BiSolidDownArrow
                          size={12}
                          className="text-primary-200"
                        />
                      ) : (
                        <BiSolidUpArrow
                          size={12}
                          className="text-primary-200"
                        />
                      )}
                      {/* <p>{user.name}</p> */}
                    </div>
                  </div>

                  {openUserMenu && (
                    <div className="absolute top-14 right-0">
                      <div className="bg-white rounded-md p-4 min-w-52 shadow-lg">
                        <UserMenu close={()=>setOpenUserMenu(false)}/>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="hidden lg:block bg-primary-200 hover:bg-primary-100 text-secondary-100 p-2 rounded-md"
                >
                  Login
                </button>
              )}

              {/* My Cart */}
              <div onClick={()=>{
                
                  // navigate("/my-cart", { replace: true });
                  setOpenCartSection(true);
                 
                
              }} className="flex text-sm cursor-pointer justify-between items-center gap-x-2 text-white bg-primary-200 p-2 rounded-md">
                <FaCartArrowDown className="animate-bounce" size={24} />

                {
                  cartItems?.length > 0? (
                    <div  className="font-bold">
                       <p>{totalQnty} Items</p>
                       <p>{displayPriceInTaka(totalPrice)}</p>
                      </div>
                  ) :<p>My Cart</p>
                }
                
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container px-4 mx-auto block lg:hidden ">
        <Search />
      </div>
      {
        openCartSection && <DisplayCartItem close={()=>setOpenCartSection(false)}/>
      }
    </header>
  );
};

export default Header;
