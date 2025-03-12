
import jwt from "jsonwebtoken"; 

export const generatedAccessToken = async (userId) => {
    const token= await jwt.sign({id:userId}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return token;

}
