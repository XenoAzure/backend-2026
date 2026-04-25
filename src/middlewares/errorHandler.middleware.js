import ServerError from '../helpers/error.helper.js'
import jwt from 'jsonwebtoken'

/**
 * Middleware centralizado de manejo de errores.
 * Debe ser registrado ÚLTIMO en main.js: app.use(errorHandlerMiddleware)
 * Los controladores y middlewares propagan errores con: next(error)
 */
function errorHandlerMiddleware(error, request, response, next) {
    // Errores de JWT
    if (error instanceof jwt.TokenExpiredError) {
        return response.status(401).json({
            ok: false,
            status: 401,
            message: 'Token expirado'
        })
    }

    if (error instanceof jwt.JsonWebTokenError) {
        return response.status(401).json({
            ok: false,
            status: 401,
            message: 'Token inválido'
        })
    }

    // Errores esperables del sistema (ServerError)
    if (error instanceof ServerError) {
        return response.status(error.status).json({
            ok: false,
            status: error.status,
            message: error.message
        })
    }

    // Errores inesperados
    console.error('[ErrorHandler]', error)
    return response.status(500).json({
        ok: false,
        status: 500,
        message: 'Error interno del servidor'
    })
}

export default errorHandlerMiddleware
