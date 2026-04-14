const getBaseEmailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cobalt</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #1e293b; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="display: flex; align-items: center;">
                                        <span style="font-size: 32px; font-weight: bold; color: #6366f1; margin-right: 12px;">Δ</span>
                                        <span style="font-size: 24px; font-weight: bold; letter-spacing: -0.02em; color: #ffffff;">Cobalt</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 40px; background-color: rgba(15, 23, 42, 0.5); border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
                            <p style="margin: 0; font-size: 14px; color: #94a3b8;">
                                © ${new Date().getFullYear()} Cobalt Team. Todos los derechos reservados.
                            </p>
                            <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
                                Si no solicitaste este correo, por favor desestímalo.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export const getVerificationEmailTemplate = (name, link) => {
    const content = `
        <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: bold; color: #ffffff;">¡Bienvenido ${name}!</h1>
        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
            Te has registrado correctamente en <b>Cobalt</b>. Para comenzar a colaborar con tu equipo en workspaces y canales, necesitamos verificar tu dirección de correo electrónico.
        </p>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center">
                    <a href="${link}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);">
                        Verificar mi Correo
                    </a>
                </td>
            </tr>
        </table>
        <p style="margin: 30px 0 0 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
            Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:<br>
            <span style="color: #6366f1; word-break: break-all;">${link}</span>
        </p>
    `;
    return getBaseEmailTemplate(content);
};

export const getResetPasswordEmailTemplate = (email, link) => {
    const content = `
        <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: bold; color: #ffffff;">Restablecer Contraseña</h1>
        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta asociada a <b>${email}</b>. Haz clic en el siguiente botón para elegir una nueva contraseña.
        </p>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center">
                    <a href="${link}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);">
                        Restablecer Contraseña
                    </a>
                </td>
            </tr>
        </table>
        <p style="margin: 30px 0 0 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
            Este enlace expirará en 24 horas por motivos de seguridad.<br>
            Si tú no solicitaste este cambio, puedes ignorar este mensaje de forma segura.
        </p>
    `;
    return getBaseEmailTemplate(content);
};
