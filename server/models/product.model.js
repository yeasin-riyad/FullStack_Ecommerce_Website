import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    image:{
        type:Array,
        default: [],
    },
    category:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    subCategory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'subCategory'
        }
    ],
    unit: {type: String,default:"", required: true},
    stock: {type: Number, required: true,default: 0},
    price: {type: Number, required: true,default: 0},
    discount: {type: Number, default: 0},
  
    description: {type: String, required: true},
    product_details: {type: String, required: true},
    more_details: {type:Object, default: {}},
    publish: {type:Boolean,default: true}
}
    
,{    timestamps: true
});


// Create a text index
// productSchema.index(
//     {name: "text",
//      description:"text"});


const ProductModel =  mongoose.model("product",productSchema);

export default ProductModel;