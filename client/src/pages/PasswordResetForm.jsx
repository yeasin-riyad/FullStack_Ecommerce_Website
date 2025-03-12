import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import axiosPublic from "../tools/axiosPublic";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordResetForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("New Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm New Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (!(email && location?.state?.data?.success)) {
      navigate("/forgot-password");
    }
  }, [location.state?.data?.success, email, navigate]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      await axiosPublic.put("user/update-password", {
        email,
        NewPassword: data.newPassword,
        ConfirmNewPassword: data.confirmNewPassword,
      });
      toast.success("Password reset successful!", {
        position: "top-center",
      });
      reset();
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again!",
        {
          position: "top-center",
        }
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              {...register("newPassword")}
              className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 top-5 right-3 flex items-center justify-center text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              id="confirmNewPassword"
              {...register("confirmNewPassword")}
              className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                errors.confirmNewPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              className="absolute inset-y-0 top-5 right-3 flex items-center justify-center text-gray-500"
            >
              {showConfirmNewPassword ? (
                <FaEyeSlash size={20} />
              ) : (
                <FaEye size={20} />
              )}
            </button>
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 text-white font-semibold rounded-md transition bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-1 ${
              isSubmitting && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetForm;
