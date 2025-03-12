import UsersModel from '../models/user.model.js';
import OrderModel from '../models/order.model.js';
import CartProductModel from '../models/cartProduct.model.js'
import mongoose from 'mongoose';
import Stripe from '../config/stripe.js';
 

export async function CashOnDeliveryOrderController(req,res){
    try{
        // userId from auth Middleware
        const userId =req.userId ; 
        const {list_items,totalAmt,addressId,subTotalAmt}=req.body;
        const payload=list_items?.map((ele)=>{
            return ({
                userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId:ele.product_id._id,
                product_details:{
                    name: ele.product_id.name,
                    image:ele.product_id.image
                },
                payment_id:"",
                payment_status:"CASH ON DELIVERY",
                delivery_address:addressId,
                subTotal_amount:subTotalAmt,
                total_amount:totalAmt
            })
        })

     const generatedOrder= await OrderModel.insertMany(payload)


    //  Remove item from Cart
    const removeCartItems= await CartProductModel.deleteMany({_id:userId})
    const updateUser= await UsersModel.updateOne({_id:userId},{shopping_cart:[]})


    return res.json({
        message:"Order Successfully.",
        error:false,
        success:true,
        data:generatedOrder
    })


    }catch(e){
        console.error(e);
        return res.status(500).json({
            message: e.message || e,
            error: true,
            success: false,
        });

    }
}

export const priceAfterDiscount = (price,discount=1)=>{
    const discountAmount= Math.ceil(Number(discount)*Number(price)/100);
    return Number(price)-Number(discountAmount);
}

export async function OnlinePaymentController (req,res){
    try{

        // userId from auth Middleware
        const userId =req.userId ; 
        const {list_items,totalAmt,addressId,subTotalAmt}=req.body;
        const line_items= list_items?.map((item)=>{
            return {
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:item.product_id.name,
                        images:item.product_id.image,
                        metadata:{
                            productId:item.product_id._id
                        }
                    },
                    unit_amount:priceAfterDiscount(item.product_id.price,item.product_id.discount)*100
                },
                adjustable_quantity:{
                    enabled:true,
                    minimum:1
                },
                quantity:item.quantity
            }
        })

        const user= await UsersModel.findById(userId)


        const params={
            submit_type:'pay',
            node:'payment',
            payment_method_types:['card'],
            customer_email:user?.email,
            metadata:{
                userId,
                addressId
            },
            line_items,
            success_url:`${process.env.FRONTEND_URL}/order-success`,
            cancel_url:`${process.env.FRONTEND_URL}/order-cancel`
        }


        const session= await Stripe.checkout.sessions.create(params)
        return res.status(200).json(session)

    }catch(e){
        res.status(500).json({
            message:e.message || e,
            error:true,
            success:false
        })
    }

}

export async function getOrderController(req,res) {

    try{
         // userId from auth Middleware
     const userId =req.userId ; 
     const orderList= await OrderModel.find({userId}).sort({createdAt:-1}).populate("delivery_address")
     return res.json({
        message:"Order List",
        data:orderList,
        error:false,
        success:true
     })
    }catch(e){
        return res.status(500).json({
            message:e.message || e,
            error:true,
            success:false
        })
    }
    
}