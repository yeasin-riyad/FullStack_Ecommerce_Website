import jwt from 'jsonwebtoken';

export const auth= async (req,res,next) =>{
    try {
        const token=req?.cookies?.access_token || req?.headers?.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({
                message: 'Token not provided',
                error: true,
                success: false,
            });
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(403).json({
                message: 'Access denied',
                error: true,
                success: false,
            });
        }
        req.userId=decoded?.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token is invalid',
            error: true,
            success: false,
        });
    }
}