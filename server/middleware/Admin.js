import UsersModel from "../models/user.model.js";

export const  admin= async (req, res, next) => {
    try{
        //Check if user is authenticated
    if(!req.userId){
        return res.status(401).json({
            message: 'Not authenticated',
            error: true,
            success: false,
        });

    }
        //Check if user is an admin
        const userId=req.userId;
        const user=await UsersModel.findById(userId);
        if(user.role !=="ADMIN"){
            return res.status(403).json({
                message: 'Unauthorized to access this resource',
                error: true,
                success: false,
            });
        }
        next();
        
    }catch (e) {
        return res.status(500).json({
            message: e.message || e,
            error: true,
            success: false,
        });
    }
    
}