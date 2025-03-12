import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Devider from "./Devider";
import axiosSecure from "../tools/axiosSecure";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import { axiosToastError } from "../tools/axiosToastError";
import { RiExternalLinkFill } from "react-icons/ri";
import { useEffect } from "react";
import { checkUserRole } from "../tools/checkUserRole";
import { handleAddItemCart } from "../store/cartProduct";
const UserMenu = ({ close }) => {
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // useEffect(() =>{
  //   checkUserRole(user?.role)
  // },[user])

  const isAdmin = checkUserRole(user?.role);
  // console.log(isAdmin,"admin")



  const handleClose = () => {
    close();
  };

  const handleLogout = async () => {
    try {
      const response = await axiosSecure.post("user/logout");
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        dispatch(handleAddItemCart([]))

        toast.success(response.data.message);
        navigate("/");
        // window.history.back();
      }
    } catch (e) {
      console.log(e);
      axiosToastError(e);
    }
  };
  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="flex gap-x-3 items-center">
        <div className="text-sm max-w-52 text-ellipsis line-clamp-1">
          {user?.name || user?.mobile}{" "}{isAdmin && <span className="font-semibold text-secondary-200">(ADMIN)</span>}
        </div>
        <Link
          onClick={handleClose}
          className="hover:text-primary-200"
          to={"/dashboard/profile"}
        >
          <RiExternalLinkFill />
        </Link>
      </div>

      <Devider />
      <div className="text-sm grid gap-1">

      {isAdmin && <>
        <Link
          onClick={handleClose}
          to={"/dashboard/category"}
          className="px-2 py-1 hover:bg-primary-100 rounded-md"
        >
          Category
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/sub-category"}
          className="px-2 py-1 hover:bg-primary-100 rounded-md"
        >
          SubCategory
        </Link>

        
      <Link
          onClick={handleClose}
          to={"/dashboard/upload-product"}
          className="px-2 py-1 hover:bg-primary-100 rounded-md"
        >
          Upload Product
        </Link>

        <Link
          onClick={handleClose}
          to={"/dashboard/products"}
          className="px-2 py-1 hover:bg-primary-100 rounded-md"
        >
          Product
        </Link>
      </>}


        <Link
          onClick={handleClose}
          to={"/dashboard/my-order"}
          className="px-2 py-1 hover:bg-primary-100 rounded-md"
        >
          My Orders
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/address"}
          className="px-2 py-1 hover:bg-primary-100 rounded-md"
        >
          Save Address
        </Link>
        <button
          onClick={handleLogout}
          className="text-left px-2 py-1 rounded-md bg-primary-100"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
