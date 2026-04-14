import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";

class UserController {
    async getMe(req, res) {
        try {
            // The user id should be decoded by the authMiddleware and attached to req.user
            // Let's check authMiddleware to see how it works
            const user_id = req.user.id;
            const user = await userRepository.getById(user_id);
            
            if (!user) {
                throw new ServerError("Usuario no encontrado", 404);
            }

            return res.status(200).json({
                ok: true,
                status: 200,
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        profile_picture: user.profile_picture,
                        created_at: user.created_at
                    }
                }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message
                });
            }
            console.error("Error in getMe:", error);
            return res.status(500).json({
                ok: false,
                status: 500,
                message: "Internal server error"
            });
        }
    }
}

const userController = new UserController();
export default userController;
