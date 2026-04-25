import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.config.js'
import ServerError from '../helpers/error.helper.js'

function authMiddleware(request, response, next) {
    try {
        //El token se envia en el header de authorization NORMALMENTE
        const auth_header = request.headers.authorization //'Bearer token'
        if(!auth_header){
            throw new ServerError('Token faltante', 401)
        }

        //Extraigo del header el token
        const auth_token = auth_header.split(' ')[1]

        if(!auth_token){
            throw new ServerError('Token invalido', 401)
        }

        //Valido el token
        const payload = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY)

        //IMPORTANTE!!!, guardo en la request la sesion del usuario
        request.user = payload
        next()
    }
    catch (error) {
        next(error)
    }

}

export default authMiddleware