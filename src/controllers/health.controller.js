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

    async getDB (request, response){
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
            console.error("ERROR EN LA DB:", error)
            return response.status(500).json(
                {
                    message: 'La DB esta fallando, contactarse con el administrador',
                    status: 500,
                    ok: false
                }
            )
        }
    }

}


const healthController = new HealthController()
export default healthController