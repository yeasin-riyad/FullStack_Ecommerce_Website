import mongoose from "mongoose";

const addressesSchema =new mongoose.Schema({
    address_line:{
        type: String,
        default: ""
    },
    city:{
        type: String,
        default: ""
    },
 
    mobile:{
        type: Number,
        default: null
    },
    status:{
        type:Boolean,
        default: true
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "users"
    }
},{
    timestamps: true,
});

const AddressModel=mongoose.model("address",addressesSchema);

export default AddressModel;