import categoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import uploadCategoryImageCloudinary from "../utils/uploadCategoryImageCloudinary.js";

export const AddCategoryController = async (req, res) => {
  try {
    const { name } = req.body; // Image is in req.file, not req.body.image
     
    // Check if the file is uploaded
    if (!name || !req.file) {
      return res.status(400).json({
        message: "Please provide name and image",
        error: true,
        success: false,
      });
    }

    // Check if category name already exists in a case-insensitive manner
    const existingCategory = await categoryModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },  // Case-insensitive regex
    });

    if (existingCategory) {
      return res.status(400).json({
        message: `${name} Category already exists. Please choose a different Category.`,
        error: true,
        success: false,
      });
    }

        const categoryImage = req?.file;
        const image=await uploadCategoryImageCloudinary(categoryImage)

    // Create category instance
    const category = new categoryModel({
      name,
      image 
    });

    // Save to database
    const savedCategory = await category.save();

    return res.status(201).json({
      message: "Category added successfully",
      error: false,
      success: true,
      data: savedCategory,
    });
  } catch (e) {
    // Handle duplicate key error specifically
    if (e.code === 11000) {
      return res.status(400).json({
        message: "This Category already exists. Please choose a different name.",
        error: true,
        success: false,
      });
    }

    // Handle other errors
    return res.status(500).json({
      message: e.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const GetCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({createdAt: -1});
    return res.status(200).json({
      message: "Categories fetched successfully",
      error: false,
      success: true,
      data: categories,
    })
    } catch (e) {
      return res.status(500).json({
        message: e.message || e,
        error: true,
        success: false,
      });
    }
}

export const UpdateCategoryController =async (req,res) => {
  try {
    const { categoryId, name } = req.body;

    if (!categoryId ||!name) {
      return res.status(400).json({
        message: "Please provide categoryId and name",
        error: true,
        success: false,
      });
    }
    
    // Check if category name already exists in a case-insensitive manner
    const existingCategory = await categoryModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },  // Case-insensitive regex
      _id: { $ne: categoryId },  // Exclude the current category from the check
    });
    

    if (existingCategory) {
      return res.status(400).json({
        message: `${name} Category already exists. Please choose a different name.`,
        error: true,
        success: false,
      });
    }
    
    // Find and update the category
    const updateCategory={
      name
    }
    const categoryImage = req?.file;
    if(categoryImage){
      updateCategory.image=await uploadCategoryImageCloudinary(categoryImage)
    }
    const category = await categoryModel.findByIdAndUpdate(categoryId, updateCategory, { new: true });
    
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });

    }
    return res.status(200).json({
      message: "Category updated successfully",
      error: false,
      success: true,
      data: category,
    }) 
    }catch (err) {
      return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
}

export const DeleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.body;
    console.log(req.body,"body......");

    if (!categoryId) {
      return res.status(400).json({
        message: "Please provide categoryId",
        error: true,
        success: false,
      });
    }
    const checkSubCategory = await SubCategoryModel.find({
      category: {
        $in:[categoryId]
      }
    }).countDocuments()

    const checkProduct = await ProductModel.find({
      category: {
        $in:[categoryId]
      }
    }).countDocuments();
    
    if(checkSubCategory>0 || checkProduct>0){
      return res.status(400).json({
        message: "This category has related subcategories or products. Please delete those first.",
        error: true,
        success: false,
      });
    }
    
 
    
    const category = await categoryModel.findByIdAndDelete(categoryId);
    
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }
    
    return res.status(200).json({
      message: "Category deleted successfully",
      error: false,
      success: true,
    })
    } catch (err) {
      return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
}