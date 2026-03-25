import express from 'express'
import authController from '../controllers/auth.controller.js'
const authRouter = express.Router()

authRouter.post(
    '/register', 
    authController.register
)

authRouter.post(
    '/login', 
    authController.login
)

authRouter.get(
    '/verify-email',
    authController.verifyEmail
)


authRouter.post(
    '/reset-password-request',
    authController.resetPasswordRequest
)

authRouter.post(
    '/reset-password/:reset_password_token',
    authController.resetPassword

)
export default authRouter