import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { AddCategoryController, DeleteCategoryController, GetCategoriesController, UpdateCategoryController } from "../controllers/category.controller.js";
import upload from "../middleware/multer.js";


const categoryRouter = Router();

categoryRouter.post('/add-category',auth,upload.single('image'),AddCategoryController);
categoryRouter.get('/get-category',GetCategoriesController)
categoryRouter.put('/update-category',auth,upload.single('image'),UpdateCategoryController)
categoryRouter.delete('/delete-category',auth,DeleteCategoryController);

export default categoryRouter;