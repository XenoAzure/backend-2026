import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";

class UserController {
    async getMe(req, res) {
        try {
            // The user id should be decoded by the authMiddleware and attached to req.user
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
                        bio: user.bio,
                        social_links: user.social_links,
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

    async updateMe(req, res) {
        try {
            const user_id = req.user.id;
            const { name, bio, profile_picture, social_links } = req.body;

            // Basic validation
            if (bio && bio.length > 300) {
                throw new ServerError("La descripción no puede superar los 300 caracteres", 400);
            }

            const updatedFields = {};
            if (name) updatedFields.name = name;
            if (bio !== undefined) updatedFields.bio = bio;
            if (profile_picture !== undefined) updatedFields.profile_picture = profile_picture;
            if (social_links) updatedFields.social_links = social_links;

            const updatedUser = await userRepository.updateById(user_id, updatedFields);

            if (!updatedUser) {
                throw new ServerError("No se pudo actualizar el usuario", 400);
            }

            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Perfil actualizado correctamente",
                data: {
                    user: {
                        id: updatedUser._id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        profile_picture: updatedUser.profile_picture,
                        bio: updatedUser.bio,
                        social_links: updatedUser.social_links,
                        created_at: updatedUser.created_at
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
            console.error("Error in updateMe:", error);
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
