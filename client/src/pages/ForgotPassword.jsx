import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axiosPublic from "../tools/axiosPublic";
import toast from "react-hot-toast";
import { axiosToastError } from "../tools/axiosToastError";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
    const navigate=useNavigate()
  const [loading, setLoading] = useState(false);

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleForgotPassword = async (data) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put("user/forgot-password", { email: data.email });
      console.log("Password reset email sent:", response.data);
      toast.success("Password reset email sent.Please Check your email");
      // Navigate to the Verify OTP page with email in location state
      navigate("/verify-otp", { state: { email: data.email } });
      reset(); // Clear the form after success
    } catch (error) {
      axiosToastError(error);
      console.error("Error sending password reset email:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
         {/* Return to Home */}
         <div className="flex items-center justify-center mb-4">
                <button
                  className="text-secondary-200 hover:text-primary-200 transition"
                  onClick={() => navigate("/")}
                >
                  <FaArrowAltCircleLeft size={24} />
                </button>
              </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Forgot Password
        </h3>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter your email address to reset your password.
        </p>
        <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 text-gray-900 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-primary-200 text-white font-semibold hover:bg-primary-100 transition flex items-center justify-center"
             
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default ForgotPassword;
