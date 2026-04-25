import userRepository from "../repository/user.repository.js"

class HealthController {
    getApi (request, response) {
        response.status(200).json(
            {
                message: "La API funciona correctamente",
                status: 200,
                ok: true
            }
        )
    }

    async getDB (request, response, next){
        try{
            await userRepository.getUser()
            return response.status(200).json(
                {
                    message: "La DB funciona correctamente",
                    status: 200,
                    ok: true
                }
            )
        }
        catch(error){
            next(error)
        }
    }

}


const healthController = new HealthController()
export default healthController