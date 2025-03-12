import {Router} from 'express';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { addSubCategoryController, deleteSubcategoriesController, getAllSubCategoriesController, updateSubcategoriesController } from '../controllers/subCategory.controller.js';



const subCategoryRouter=Router();

// Add SubCategory Api
subCategoryRouter.post('/add-subcategory',auth,upload.array('image'),addSubCategoryController)
// Get All Subcategories Api
subCategoryRouter.get('/get-subcategories',getAllSubCategoriesController)

//update Subcategories Api
subCategoryRouter.put('/update-subcategories',auth,upload.array('image'),updateSubcategoriesController)
//delete Subcategories Api
subCategoryRouter.delete('/delete-subcategories',auth,deleteSubcategoriesController)

export default subCategoryRouter;