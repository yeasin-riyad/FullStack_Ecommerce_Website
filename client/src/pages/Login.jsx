import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaArrowAltCircleLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosPublic from "../tools/axiosPublic";
import toast from "react-hot-toast";
import { axiosToastError } from "../tools/axiosToastError";
import Spinner from "../components/Spinner";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // For navigation

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      const response = await axiosPublic.post("user/login", data);
      toast.success("Login successful!");
      localStorage.setItem("access_token", response?.data?.data?.access_token); // Store access token in local storage
      localStorage.setItem("refresh_token", response?.data?.data?.refresh_token); // Store refresh token in local storage
      console.log(response?.data?.data)
      navigate(-1); // Redirect to home or dashboard after success
    } catch (error) {
      axiosToastError(error);
      console.error("Error logging in:", error.response?.data || error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border-2 rounded-lg bg-slate-50">
      {/* Return to Home */}
      <div className="flex items-center justify-center mb-4">
        <button
          className="text-secondary-200 hover:text-primary-200 transition"
          onClick={() => navigate("/")}
        >
          <FaArrowAltCircleLeft size={24} />
        </button>
      </div>

      <h2 className="text-2xl font-bold text-secondary-200 text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-secondary-200">Email</label>
          <input
            type="email"
            className="w-full border-2 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-semibold text-secondary-200">Password</label>
          <div className="relative">
            <input
              type= {showPassword ? "text" : "password"}
              className="w-full border-2 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <span
              className="absolute top-2.5 right-3 cursor-pointer text-secondary-200"
              onClick={togglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        

          {/* Additional Links */}
          <div className="flex items-center justify-end mt-2">
            <Link to="/forgot-password" className="text-primary-200 hover:underline">
              Forgot Password?
            </Link>
           
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-primary-200 text-white font-semibold hover:bg-primary-100 transition flex items-center justify-center"
          disabled={loading} // Disable button while loading
        >
          {loading ? <Spinner /> : "Login"}
        </button>
      </form>

      {/* Not Registered Yet? */}
      <p className="text-sm text-secondary-200 text-center mt-4">
        Not registered yet?{" "}
        <Link to="/register" className="text-primary-200 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
