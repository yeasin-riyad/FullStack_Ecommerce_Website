import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({   
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    orderId:{
        type: String,
        required: true,
        unique: true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    product_details:{
        name:String,
        image:Array,
    },
    payment_id:{
        type: String,
    },
    payment_status:{
        type: String,
        required: true
    },
    delivery_address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'address'
    },
    delivery_status:{
        type: String,
    },
    subTotal_amount:{
        type: Number,
        required: true
    },
    total_amount:{
        type: Number,
        required: true
    },
    invoice_recipient:{
        type: String,
    }
},{
    timestamps: true
})

const OrderModel =  mongoose.model("order", orderSchema);

export default OrderModel;