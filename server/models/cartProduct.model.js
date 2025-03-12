import mongoose, { mongo } from "mongoose";

const cartProductSchema =new mongoose.Schema({

    product_id: {type: mongoose.Schema.Types.ObjectId,ref:"product", required: true},
    quantity:{type:Number, required: true,default:1},
    userId:{type:mongoose.Schema.Types.ObjectId, required: true,ref:"users"},


},{
    Timestamp:true,
})

const CartProductModel = mongoose.model('cartProduct', cartProductSchema);

export default CartProductModel;