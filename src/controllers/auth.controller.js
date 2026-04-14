import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import authService from "../services/auth.service.js";
import ENVIRONMENT from "../config/environment.config.js";

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

            const htmlResponse = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="refresh" content="3;url=${ENVIRONMENT.URL_FRONTEND || 'http://localhost:5173'}/login">
                <title>Cobalt - Email Verificado</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    :root {
                        --bg-color: #0f172a;
                        --text-light: #f8fafc;
                        --bg-grad-1: rgba(99, 102, 241, 0.15);
                        --bg-grad-2: rgba(168, 85, 247, 0.15);
                        --glass-bg: rgba(15, 23, 42, 0.8);
                        --border-color: rgba(255, 255, 255, 0.1);
                    }
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body {
                        font-family: 'Inter', sans-serif;
                        background-color: var(--bg-color);
                        background-image:
                        radial-gradient(at 0% 0%, var(--bg-grad-1) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, var(--bg-grad-2) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, var(--bg-grad-1) 0px, transparent 50%);
                        color: var(--text-light);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        padding: 2rem;
                    }
                    .glass-card {
                        background: var(--glass-bg);
                        backdrop-filter: blur(12px);
                        border: 1px solid var(--border-color);
                        padding: 2.5rem;
                        width: 100%;
                        max-width: 420px;
                        box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
                        animation: fadeInUp 0.4s ease-out forwards;
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .title {
                        font-size: 2rem;
                        font-weight: 700;
                        margin-bottom: 1.5rem;
                        background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .success-text {
                        color: #10b981;
                        font-size: 1rem;
                        background: rgba(16, 185, 129, 0.1);
                        padding: 1rem;
                        border-radius: 0.5rem;
                        border: 1px solid rgba(16, 185, 129, 0.2);
                        margin-bottom: 1.5rem;
                    }
                    .text-muted {
                        color: #94a3b8;
                        font-size: 0.875rem;
                    }
                </style>
            </head>
            <body>
                <div class="glass-card">
                    <h1 class="title">Cobalt</h1>
                    <div class="success-text">Mail verificado exitosamente</div>
                    <p class="text-muted">Redirigiendo al inicio de sesión en 3 segundos...</p>
                </div>
            </body>
            </html>
            `;

            response.status(200).send(htmlResponse);
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