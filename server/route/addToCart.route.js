import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addToCartController, getCartItemsController, updateCartController } from "../controllers/addToCart.controller.js";

const addToCart = Router();

// Add to cart
addToCart.post('/add-to-cart',auth,addToCartController)
//Get cart items
addToCart.get('/get-cart-items',auth,getCartItemsController)
// update cart items
addToCart.post('/update-cart-items',auth,updateCartController)

export default addToCart;