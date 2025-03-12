import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axiosSecure from "../tools/axiosSecure";
import { axiosToastError } from "../tools/axiosToastError";
import toast from "react-hot-toast";
import { updateAvatar } from "../store/userSlice";
import { IoIosCloseCircleOutline } from "react-icons/io";


const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const [userData,setUserData] = useState({
  //   name: user?.name,
  //   email: user?.email,
  //   mobile: user?.mobile,
  //   address: user?.address,

  // })


  // Upload Avatar
  const handleUploadAvatar = async (e) => {
    if (!(e.target.files && e.target.files.length)) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);

    try {
      const response = await axiosSecure.put("user/upload-avatar", formData);
      if (response.data.success) {
        toast.success(response.data.message);
        close();
        dispatch(updateAvatar(response.data?.data?.avatar));
      }
    } catch (err) {
      axiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

 
  // const handleOnchange=(e) => {
  //   setUserData({...userData, [e.target.name]: e.target.value });
  // };

  return (
    <section className="z-[10000] fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded p-4 flex flex-col items-center">
        {/* Close Button */}
        <button className="ml-auto hover:text-primary-200" onClick={close}>
          <IoIosCloseCircleOutline size={30} className="text-primary-500" />
        </button>

        {/* Avatar Display */}
        <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden drop-shadow-md">
          {user?.avatar ? (
            <img src={user?.avatar} alt={user.name} className="w-full h-full" />
          ) : (
            <FaRegUserCircle size={60} />
          )}
        </div>

        {/* Upload Avatar */}
        <label htmlFor="uploadProfile">
          <div className="border cursor-pointer border-primary-200 hover:bg-primary-200 px-4 py-1 rounded text-sm my-3">
            {loading ? "Loading..." : "Upload"}
          </div>
          <input
            onChange={handleUploadAvatar}
            type="file"
            id="uploadProfile"
            name="avatar"
            accept="image/png, image/jpeg"
            className="hidden"
          />
        </label>

       
      </div>
    </section>
  );
};

export default UserProfileAvatarEdit;
