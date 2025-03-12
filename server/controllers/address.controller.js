import UsersModel from '../models/user.model.js';
import AddressModel from '../models/address.model.js';

export const addAddresscontroller=async (req,res)=>{
    try {
        const userId=req.userId;
        const {address_line, city, mobile} = req.body;
        if(!address_line ||!city ||!mobile){
            return res.status(400).json({
                message: "Incomplete address information",
                error: true,
                success: false,
            });
        }
        const user=await UsersModel.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }
        const address=new AddressModel({
            address_line,
            city,
            mobile,
            user: userId,
        });
       const  saveAddress=await address.save();
        await user.address_details.push(saveAddress._id);
        const result=await user.save();
        res.status(201).json({
            message: "Address added successfully",
            error: false,
            success: true,
            address: saveAddress,
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }


}

export const getAddressesController=async (req,res)=>{
    try {
        const userId=req.userId;
        const addressess=await AddressModel.find({user:userId}).sort({createdAt:-1});
    

        res.status(200).json({
            message: "Addresses retrieved successfully",
            error: false,
            success: true,
            address: addressess,
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}


export const editAddressController=async (req,res)=>{
    try{
        const userId =req.userId
        const {address_line, city, mobile,id} = req.body;
        if(!address_line ||!city ||!mobile){
            return res.status(400).json({
                message: "Incomplete address information",
                error: true,
                success: false,
            });
        }
        const user=await UsersModel.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }
        const update =await AddressModel.findByIdAndUpdate(id,{address_line, city, mobile},{new:true})
        if(update) {
            return res.json({
                message: "Address updated .",
                error: false,
                success: true,
            });
         }else {
            return res.status(400).json({
                message: "Address not found.",
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
}

export const deleteAddressController= async (req,res)=>{
    try{
        const userId =req.userId
        const {id} = req.body;
        if(!id){
            return res.status(400).json({
                message: "Incomplete address information",
                error: true,
                success: false,
            });
        }
        const user=await UsersModel.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        const result= await AddressModel.findByIdAndDelete(id)
        if(result) {
            return res.json({
                message: "Address Deleted Successfully .",
                error: false,
                success: true,
            });
         }else {
            return res.status(400).json({
                message: "Address not found.",
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
}