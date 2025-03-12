import axiosSecure from "./axiosSecure";
import { axiosToastError } from "./axiosToastError";

export const fetchCategories = async () => {
    try {
      const response = await axiosSecure.get("category/get-category");
    return response?.data?.data;
       } catch (err) {
      axiosToastError(err);
    }
  };