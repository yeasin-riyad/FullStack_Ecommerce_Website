import CartProductModel from "../models/cartProduct.model.js";
import UsersModel from "../models/user.model.js";

// Add product to cart

export const addToCartController = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const userId = req.userId;
        const user = await UsersModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                error: true,
                success: false,
            });
        }
        const product = await CartProductModel.findOne({
            userId,
            product_id,
        });
        if (product) {
            product.quantity += quantity;
            await product.save();
            return res.json({
                message: "Product updated in cart.",
                error: false,
                success: true,
            })
        }
        const newProduct = new CartProductModel({
            userId,
            product_id,
            quantity,
        });
        const result=await newProduct.save();
        if (result) {
            await UsersModel.updateOne({_id:userId},{
                $push: {shopping_cart: result?._id}
            })
            return res.json({
                message: "Product added to cart.",
                error: false,
                success: true,
            });
        }
    }catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message || e,
            error: true,
            success: false,
        });
    }   

}

// Get cart items

export const getCartItemsController = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await UsersModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                error: true,
                success: false,
            });
        }
        const cartItems = await CartProductModel.find({ userId }).populate("product_id");
        return res.json({
            message: "Cart items retrieved successfully.",
            error: false,
            success: true,
            data: cartItems,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message || e,
            error: true,
            success: false,
        });
    }
};

export const  updateCartController = async (req, res) => {
    try{
        const {id,quantity}=req.body;
    const userId=req.userId;
    if(!userId) {
        return res.status(401).json({
            message: "Unauthorized access.",
            error: true,
            success: false,
        });
    }
    const user = await UsersModel.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: "User not found.",
            error: true,
            success: false,
        });
    }
    if(quantity<=0) {
        await CartProductModel.findByIdAndDelete(id)
        await UsersModel.findByIdAndUpdate(userId, {
            $pull: { shopping_cart: id }
        });
                return res.json({
            message: "Product removed from cart.",
            error: false,
            success: true,
        });
    }
     const update= await CartProductModel.findByIdAndUpdate(id,{quantity}, {new: true})
     if(update) {
        return res.json({
            message: "Product updated in cart.",
            error: false,
            success: true,
        });
     }else {
        return res.status(400).json({
            message: "Product not found.",
            error: true,
            success: false,
        });
     }
     
    }catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message || e,
            error: true,
            success: false,
        });
    }
};