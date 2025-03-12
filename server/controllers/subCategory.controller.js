import mongoose from "mongoose";
import SubCategoryModel from "../models/subCategory.model.js";
import uploadSubCategoryImageCloudinary from "../utils/uploadSubCategoryImageCloudinary.js";
import ProductModel from "../models/product.model.js";

export const addSubCategoryController= async (req,res)=>{
    try {
        let {name, category} = req.body;


    const categories=Array.isArray(category)?category:[category];
        const subCategoryImage=req.files;
        if(!name ||!category || !subCategoryImage){
            return res.status(400).json({
                message: 'Provide name,Category and SubCategory image',
                error: true,
                success: false,
            });
        }

        // Check if subCategory name is already exists in a case-insensitive manner
        const existingSubCategory = await SubCategoryModel.findOne({
            name: { $regex: new RegExp(`^${name}$`), $options: "i" },
            category: { $in: categories }, // Check if the category exists in the array

        });
                if(existingSubCategory){
            return res.status(400).json({
                message: 'Subcategory name already exists',
                error: true,
                success: false,
            });
        }

         // Upload SubCategory Image from Array in Cloudinary
         const subCategoryImages=[];
         for(let i=0; i<subCategoryImage.length; i++){
             const imagePath = await uploadSubCategoryImageCloudinary(subCategoryImage[i]);
             subCategoryImages.push(imagePath);
         }

        // Create subcategory Instance
        const subCategory = new SubCategoryModel({
            name,
            category:categories,
            image:subCategoryImages,
        });

        // Save subcategory to the database
         const savedSubCategory= await subCategory.save();
         if(!savedSubCategory){
             return res.status(500).json({
                 message: 'An error occurred while saving the subcategory',
                 error: true,
                 success: false,
             });
         }
         // Return the saved subcategory with its id and image URL
         return res.status(201).json({
             message: 'Subcategory created successfully',
             error: false,
             success: true,
             data: savedSubCategory,
         });
    } catch (error) {
        console.error(error);
        // Handle Duplicate key error specifically
        if(error.code === 11000){
            return res.status(400).json({
                message: 'Subcategory name already exists. Please add a different Subcategory name',
                error: true,
                success: false,
            });
        }
        // Return generic error message
        return res.status(500).json({
            message: 'An error occurred while creating the subcategory'|| error,
            error: true,
            success: false,
        });
      
    }
}

export const getAllSubCategoriesController = async (req, res) => {
    try {
        const subcategories = await SubCategoryModel.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "category",   // Make sure "category" matches the field name
                select: "name _id", // Only fetch the name and _id from the category
            });

        if (!subcategories || subcategories.length === 0) {
            return res.status(200).json({
                message: "No subcategories found",
                error: false,
                success: true,
                data: [],
            });
        }

        return res.status(200).json({
            message: "Subcategories fetched successfully",
            error: false,
            success: true,
            data: subcategories,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while fetching subcategories",
            error: true,
            success: false,
        });
    }
};

export const updateSubcategoriesController=async (req, res) => {
    try {
        let { subcategoryId, name, category } = req.body;

        if(!subcategoryId || !name || !category) {
            return res.status(400).json({
                message: "Provide subcategoryId, name and category",
                error: true,
                success: false,
            });
        }

        const categories=Array.isArray(category)?category:[category];

     // Check if subcategory name already exists in a case-insensitive manner
      const existingSubCategory = await SubCategoryModel.findOne({ name: {$regex: new RegExp(name, 'i')}});
       if(existingSubCategory && existingSubCategory._id.toString()!== subcategoryId){
           return res.status(400).json({
            message: 'Subcategory name already exists.Please add different SubCategory Name.',
            error: true,
            success: false,
        });
      }
       // Check if subcategoryId is valid
        const isValidId =mongoose.Types.ObjectId.isValid(subcategoryId);
        if (!isValidId) {
            return res.status(400).json({
                message: "Invalid subcategoryId",
                error: true,
                success: false,
            });
        }

        // find and update SubCategory
        const updatedSubCategory={
            name,
            category:categories,           
        }
        const subCategoryImage= req?.files;
        const subCategoryImages=[];

        if(subCategoryImage?.length>0){
             // Upload SubCategory Image from Array in Cloudinary
         for(let i=0; i<subCategoryImage.length; i++){
             const imagePath = await uploadSubCategoryImageCloudinary(subCategoryImage[i]);
             subCategoryImages.push(imagePath);
         }
         updatedSubCategory.image=subCategoryImages;
        }
        const result = await SubCategoryModel.findByIdAndUpdate(subcategoryId, updatedSubCategory, { new: true });
        if (!result) {
            return res.status(404).json({
                message: "Subcategory not found",
                error: true,
                success: false,
            });
        }
        return res.status(200).json({
            message: "Subcategory updated successfully",
            error: false,
            success: true,
            data: result,
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while updating the subcategory",
            error: true,
            success: false,
        });
    }



      
};

export const deleteSubcategoriesController = async (req, res) => {
    try {
        const { subcategoryId } = req.body;
        if (!subcategoryId) {
            return res.status(400).json({
                message: "Provide subcategoryId",
                error: true,
                success: false,
            });
        }
        // Check if subcategoryId is valid
        const isValidId = mongoose.Types.ObjectId.isValid(subcategoryId);
        if (!isValidId) {
            return res.status(400).json({
                message: "Invalid subcategoryId",
                error: true,
                success: false,
            });
        }
        const checkProduct = await ProductModel.find({
            subCategory: {
              $in:[subcategoryId]
            }
          }).countDocuments();
          
          if(checkProduct>0){
            return res.status(400).json({
              message: "This SubCategory has related  products. Please delete those Products first.",
              error: true,
              success: false,
            });
          }
        // Delete the subcategory
        const result = await SubCategoryModel.findByIdAndDelete(subcategoryId);
        if (!result) {
            return res.status(404).json({
                message: "Subcategory not found",
                error: true,
                success: false,
            });
        }
        return res.status(200).json({
            message: "Subcategory deleted successfully",
            error: false,
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting the subcategory",
            error: true,
            success: false,
        });
    }
}