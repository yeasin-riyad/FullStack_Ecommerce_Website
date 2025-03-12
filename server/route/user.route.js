import { Router } from "express";
import { forgotPasswordController, getUserDetailsController, loginUserController, logoutController, refreshTokenController, registerUserController, resetPasswordOtpController, updatePasswordController, updateUserDetailsController, uploadAvatarController, verifyEmailController } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

// Register User Api
userRouter.post('/register',registerUserController)

// Verify Email Api
userRouter.post('/verify-email',verifyEmailController);

// Login User Api
userRouter.post('/login',loginUserController)

// Logout User Api
userRouter.post('/logout',auth,logoutController)

// Upload Avatar Api
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatarController)

// Update User Details Api
userRouter.put('/update-user', auth,updateUserDetailsController)

// Forgot Password Api
userRouter.put('/forgot-password',forgotPasswordController)

// Reset Password OTP Api
userRouter.put('/verify-otp',resetPasswordOtpController)

// Update Password Api
userRouter.put('/update-password',updatePasswordController)

// Refresh Token Api
userRouter.post('/refresh-token',refreshTokenController)

// Import User Router
userRouter.get('/get-user',auth,getUserDetailsController)

// Export User Router
export default userRouter;