import { Router } from "express";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { addProductController, deleteProductByIdController, editProductByIdController, getAllProductsController, getProductByCategoryIdSubcategoryId, getProductByIdController, getProductDetails } from "../controllers/product.controller.js";
import { admin } from "../middleware/Admin.js";


const productRouter = Router();

// Create Product Api
 productRouter.post('/add-product',auth,admin,upload.array('image'),addProductController)
 // Get All Product Api
 productRouter.post('/get-all-products',getAllProductsController)
//  Get Product by ProductId
 productRouter.post('/get-product-by-id',getProductByIdController)
 // Get Product by categoryId and SubcategoryId
 productRouter.post('/get-product-by-category-and-subcategory',getProductByCategoryIdSubcategoryId)
 
 productRouter.post('/get-product-details',getProductDetails)

//  Edit Product
productRouter.put('/edit-product',auth,admin,upload.array('image'),editProductByIdController)

// Delete Product by Id
productRouter.delete('/delete-product',auth,admin,deleteProductByIdController)

 // Export Product Router

export default productRouter;