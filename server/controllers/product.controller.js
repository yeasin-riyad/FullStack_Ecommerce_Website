import { request } from "express";
import ProductModel from "../models/product.model.js";
import uploadProductImageCloudinary from "../utils/uploadProductImageCloudinary.js";

export const addProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      more_details,
      publish,
      product_details,
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      !subCategory ||
      !unit ||
      !price ||
      !discount ||
      !more_details ||
      !publish ||
      !product_details
    ) {
      return res.status(400).json({
        message: "Provide all required fields",
        error: true,
        success: false,
      });
    }
    const categories = Array.isArray(category) ? category : [category];
    const subCategories = Array.isArray(subCategory)
      ? subCategory
      : [subCategory];
    const productImage = req.files;
    // Check if product is already exists in case-insensitive manner
    const existingProduct = await ProductModel.findOne({
      $or: [{ name: new RegExp(`^${name}$`, "i") }],
    });
    if (existingProduct) {
      return res.status(400).json({
        message: "Product already exists with this name",
        error: true,
        success: false,
      });
    }
    // Upload Product Image from Array
    const productImages = [];
    for (let i = 0; i < productImage.length; i++) {
      const productImagePath = await uploadProductImageCloudinary(
        productImage[i]
      );
      productImages.push(productImagePath);
    }
    // Create Product Instance
    const newProduct = new ProductModel({
      name,
      description,
      product_details,
      category: categories,
      subCategory: subCategories,
      unit,
      stock,
      price,
      discount,
      more_details: JSON.parse(more_details),
      publish,
      image: productImages,
    });
    // Save Product
    const savedProduct = await newProduct.save();

    // Return Success Response with Product
    return res.status(201).json({
      message: "Product added successfully.",
      data: savedProduct,
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = ""  } = req.body;
    const skip = (page - 1) * limit;

    const query = search
      ? { name: { $regex: search, $options: "i" } } // Case-insensitive partial match
      : {};
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
      ProductModel.countDocuments(query),
    ]);
    return res.status(200).json({
      message: "Products fetched successfully",
      data,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const editProductByIdController = async (req, res) =>{
  try {
    const { productId, name, description,image, category, subCategory, unit, stock=0, price, discount, more_details, publish, product_details } = req.body;
    if (!productId ||!name ||!description ||!category ||!subCategory ||!unit ||!price ||!discount ||!more_details ||!publish ||!product_details) {
      return res.status(400).json({
        message: "Provide all required fields",
        error: true,
        success: false,
      });
    }
   
    const categories = Array.isArray(category) ? category : [category];
    const subCategories = Array.isArray(subCategory)
      ? subCategory
      : [subCategory];
    const productImage = req.files;
    // Check if product is already exists in case-insensitive manner
    // const existingProduct = await ProductModel.findOne({
    //   $or: [{ name: new RegExp(`^${name}$`, "i") }],
    // });
    // if (existingProduct) {
    //   return res.status(400).json({
    //     message: "Product already exists with this name",
    //     error: true,
    //     success: false,
    //   });
    // }
    // Upload Product Image from Array
    let productImages = [];
    if(req.files.length > 0) {
      for (let i = 0; i < productImage.length; i++) {
        const productImagePath = await uploadProductImageCloudinary(
          productImage[i]
        );
        productImages.push(productImagePath);
      }
    }else{
      productImages = [...image];
    }
   

    // Update Product Instance
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        product_details,
        category: categories,
        subCategory: subCategories,
        unit,
        stock,
        price,
        discount,
        more_details: JSON.parse(more_details),
        publish,
        image: productImages,
      },
      { new: true }
    );
    // Return Success Response with Product
    return res.status(200).json({
      message: "Product updated successfully.",
      data: updatedProduct,
      error: false,
      success: true,
    });


  }catch(err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export const getProductByIdController = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      return res.status(400).json({
        message: "Provide categoryId",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      $and: [{ category: { $in: categoryId } }, { publish: true }],
    }).limit(20);

    return res.status(200).json({
      message:
        products.length > 0
          ? "Products fetched successfully"
          : "No products available for this category",
      data: products, // Returning an empty array if no products found
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategoryIdSubcategoryId= async (req, res) => {
  try {
    const { categoryId, subcategoryId,page=1,limit=10 } = req.body;
    if (!categoryId ||!subcategoryId) {
      return res.status(400).json({
        message: "Provide both categoryId and subcategoryId",
        error: true,
        success: false,
      });
    }
    const skip = (page - 1) * limit;
    const query = {
      $and: [{ category: {$in:categoryId}}, { subCategory: {$in:subcategoryId} }, { publish: true }],
    }

  
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query),
    ]);
    return res.status(200).json({
      message: "Products fetched successfully",
      data,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      error: false,
      success: true,
    })
}catch (e) {
  return res.status(500).json({
    message: e.message || e,
    error: true,
    success: false,
  });
}
}

export const getProductDetails = async(req, res) =>{
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        message: "Provide productId",
        error: true,
        success: false,
      });
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Product details fetched successfully",
      data: product,
      error: false,
      success: true,
    })
    } catch (e) {
      return res.status(500).json({
        message: e.message || e,
        error: true,
        success: false,
      });
    }
}

export const deleteProductByIdController = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        message: "Provide productId",
        error: true,
        success: false,
      });
    }
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Product deleted successfully",
      data: deletedProduct,
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}
