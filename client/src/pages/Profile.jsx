import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import { useForm } from "react-hook-form";
import axiosSecure from "../tools/axiosSecure";
import toast from "react-hot-toast";
import { axiosToastError } from "../tools/axiosToastError";
import ButtonSpinner from "../components/ButtonSpinner";
import { fetchUserDetails } from "../tools/fetchUserDetails";
import { setUser } from "../store/userSlice";

const Profile = () => {
  const [openUserProfileAvatar, setOpenUserProfileAvatar] = useState(false);
  const user = useSelector((state) => state?.user);
  const [saveChanges, setSaveChanges] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // <-- use setValue to update form fields dynamically
  } = useForm();

  // Update form fields when user data is available
  useEffect(() => {
    if (user) {
      setValue("name", user?.name || "");
      setValue("email", user?.email || "");
      setValue("mobile", user?.mobile || "");
      setValue("address", user?.address || "");
    }
  }, [user, setValue]); // Runs when `user` changes

  // Form Submit Handler
  const onSubmit = async (data) => {
    try {
      setSaveChanges(true);
      const response = await axiosSecure.put("user/update-user", data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        const updatedUser = await fetchUserDetails();
        dispatch(setUser(updatedUser));
      }
    } catch (err) {
      axiosToastError(err);
    } finally {
      setSaveChanges(false);
    }
  };

  return (
    <div className="px-2 lg:px-4">
      {/* User Avatar */}
      <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden drop-shadow-md">
        {user?.avatar ? (
          <img src={user?.avatar} alt={user?.name} className="w-full h-full" />
        ) : (
          <FaRegUserCircle size={60} />
        )}
      </div>

      <button
        onClick={() => setOpenUserProfileAvatar(true)}
        className="text-sm min-w-20 border border-primary-100 hover:border-primary-200 
        px-3 py-1 rounded-full mt-3 hover:bg-primary-200"
      >
        Edit Profile
      </button>

      {openUserProfileAvatar && (
        <UserProfileAvatarEdit close={() => setOpenUserProfileAvatar(false)} />
      )}

      {/* User Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Name</label>
          <input
            {...register("name")}
            type="text"
            className="w-full border rounded px-3 py-1 focus:outline-primary-200"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        {/* Mobile */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Mobile</label>
          <input
            placeholder="Input Your Mobile Number"
            {...register("mobile", {
              pattern: {
                value: /^\d+$/,
                message: "Only numbers are allowed",
              },
            })}
            type="text"
            className="w-full border rounded px-3 py-1 focus:outline-primary-200"
          />
          {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile.message}</p>}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email", {
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
            type="email"
            className="w-full border rounded px-3 py-1 focus:outline-primary-200"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        {/* Change Password */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Change Password</label>
          <input
            placeholder="Enter New Password"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            className="w-full border rounded px-3 py-1 focus:outline-primary-200"
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        {saveChanges ? (
          <ButtonSpinner />
        ) : (
          <button type="submit" className="w-full text-secondary-200 px-4 py-2 rounded mt-2 bg-primary-200">
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;
