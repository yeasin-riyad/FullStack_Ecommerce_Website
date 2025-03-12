import jwt from 'jsonwebtoken';
import UsersModel from '../models/user.model.js';
export const generatedRefreshToken = async (userId) => {
    const refreshToken = await jwt.sign({id:userId}, process.env.REFT_SECRET, {expiresIn: '30d'});

    const updateRefreshTokenUser= await UsersModel.findOneAndUpdate({id:userId}, {refreshToken},{new:true}); 
    return refreshToken;
}