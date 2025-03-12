import mongoose from "mongoose";


const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile:{
        type: Number,
        default:null
    },
    refreshToken: {
        type: String,
        default: ""
    },
    verified:{
        type: Boolean,
        default: false 
    },
    last_logit_date: {
        type: Date,
        default: ""
    },
    status:{
        type:String,
        enum: ["Active", "Inactive","Suspended"],
        default: "Active"
    },

    address_details:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "address"
        }
    ],
    shopping_cart:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"cartProduct"
        }
    ],
    orderHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order"
        }
    ],
    forgot_password_otp:{
        type: String,
        default: null
    },
    forgot_password_expiry:{
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },

},{

    // Which add createdAt and UpdateAt
    timestamps: true
})

const UsersModel = mongoose.model('users', userSchema);

export default UsersModel;