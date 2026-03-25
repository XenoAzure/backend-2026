/* 
Crear la class WorkspaceRepository con los sig metodos:
- create()
- daleteById()
- getById()
- updateById()
*/

import WorkspaceModel from "../models/workspace.model.js";
class WorkspaceRepository {
    async create(title, description, url_image, active) {
        const user = await WorkspaceModel.create({
            title: title,
            description: description,
            url_image,
            active
        })
        console.log("Workspace created: ", user);
    };
    async deleteById(workspace_id) {
        await WorkspaceModel.findByIdAndDelete(workspace_id);
    };
    async getById(workspace_id) {
        return await WorkspaceModel.findById(workspace_id)
    };
    async updateById(workspace_id, new_workspace_props) {
        const new_user = WorkspaceModel.findByIdAndUpdate(workspace_id, new_workspace_props, { new: true })
        return new_user;
    };
}
const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository;


/* 
Para manejar asincronia en JS existen 3 formas comunes:

Con callbacks:
Cuando la funcion acabe la accion se ejecutara la callback
Cuando termines de pensar decime tu idea

sincronizarPDF(
    (result) => {
        console.log('El pdf sincronizado es ' , result)
        enviarMailNotificacion(
            (result) => {
                console.log("mail enviado")
            }
        )
    }
)

Con async / await (La mas recomendada):
Cuando la la promesa se resuelve el resto de codigo que sigue al await se ejecuta
Aguardare a que termines de pensar y ahi dime tu idea

const result = await sincronizarPDF()
console.log('El pdf sincronizado es ' , result)
const mail_result = await enviarMailNotificacion()
console.log("mail enviado")


Con then y catch:
Las promesas tienen acceso al metodo .then y .catch. .then se ejecutara cuando la promesa se resuelva, a su vez then recibe una callback que es la accion que tendra que ejecutar cuando termine de resolverse la promesa. El catch se activa si hay un error en la promesa y tambien recibe una callback que se ejecutara si hay error.

sincronizarPDF()
.then(
    (result) => {
        console.log('El pdf sincronizado es ' , result)
        enviarMailNotificacion().then(
            (result) => {
                console.log("mail enviado")
            }
        )
    }
)

*/

