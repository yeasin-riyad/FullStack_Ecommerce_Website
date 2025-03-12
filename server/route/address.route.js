import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addAddresscontroller, deleteAddressController, editAddressController, getAddressesController } from "../controllers/address.controller.js";

const addressRouter=Router();

// add address router
addressRouter.post('/add-address',auth,addAddresscontroller);
addressRouter.get('/get-address',auth,getAddressesController);
addressRouter.post('/edit-address',auth,editAddressController);
addressRouter.delete('/delete-address',auth,deleteAddressController)
export default addressRouter;