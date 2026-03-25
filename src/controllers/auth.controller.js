import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import authService from "../services/auth.service.js";

class AuthController {
    async register(req, res) {

        try {

            const { email, name, password } = req.body;

            await authService.register({ name, email, password })

            return res.status(201).json({
                ok: true,
                status: 201,
                message: "El usuario se ha creado exitosamente",
            });
        }
        catch (error) {
            //Errores esperables en el sistema
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.error('Error inesperado en el registro', error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal server error"
                    }
                )
            }
        }
    }


    async login(req, res) {
        try {
            const { email, password } = req.body;
            const auth_token = await authService.login({ email, password })
            return res.status(200).json({
                message: "Login successful",
                status: 200,
                ok: true,
                data: {
                    auth_token: auth_token
                }
            });
        }
        catch (error) {
            //Errores esperables en el sistema
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.error('Error inesperado en el login', error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal server error"
                    }
                )
            }
        }
    }

    async verifyEmail(request, response) {
        try {
            const { verify_email_token } = request.query

            await authService.verifyEmail({ verify_email_token })

            response.status(200).send(`<h1>Mail verificado exitosamente</h1>`)
        }
        catch (error) {
            //Errores esperables en el sistema
            if (error instanceof ServerError) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }

            else {
                console.error('Error inesperado en el login', error)
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal server error"
                    }
                )
            }
        }

    }

    async resetPasswordRequest(req, res) {
        try {
            const { email } = req.body;
            await authService.resetPasswordRequest({ email });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Se ha enviado un correo electrónico para restablecer la contraseña",
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message,
                });
            }
            console.log(error)
            return res.status(500).json({
                ok: false,
                status: 500,
                message: "Error al solicitar el restablecimiento de contraseña",
            })
        }
    }

    async resetPassword(req, res) {
        try {
            const { reset_password_token } = req.params;
            const { password } = req.body;
            await authService.resetPassword({ reset_password_token, password });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "La contraseña se ha restablecido exitosamente",
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                status: 500,
                message: "Error al restablecer la contraseña",
            })
        }
    }


}
const authController = new AuthController();
export default authController

/* 
Hacer el flujo de restablecimiento de contraseña

    POST /api/auth/reset-password-request
    body: {email}
    Esto enviara un mail al email proporcionado con un link para restablecer la password, ese link tendra un JWT firmado con datos del usuario como el email o id.
    
Por otro lado desarrollaran el 
    POST /api/auth/reset-password/:reset_token
    body: {new_password}
    El backend valida el token enviado y la nueva contraseña, si todo esta bien cambia la password

*/