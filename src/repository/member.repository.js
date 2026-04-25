/* 
WorkspaceMemberRepository
    - create (fk_id_user, fk_id_workspace, role)
    - updateRole(id_member, role)
    - delete(id_member)
    - getMemberList(workspace_id) //Obtiene lista de miembros relacionados a ese espacio de trabajo
*/


import WorkspaceMember from "../models/workspaceMember.model.js"
class WorkspaceMemberRepository {
    async getMemberByWorkspaceAndUserId(fk_id_workspace, fk_id_user) {
        return await WorkspaceMember.findOne({ fk_id_workspace, fk_id_user })
    }
    async create(fk_id_workspace, fk_id_user, role, status = 'accepted') {
        return await WorkspaceMember.create({
            fk_id_workspace: fk_id_workspace,
            fk_id_user: fk_id_user,
            role: role,
            status: status
        })
    }
    async updateStatusById(member_id, status) {
        return await WorkspaceMember.findByIdAndUpdate(
            member_id,
            { status: status },
            { new: true }
        )
    }
    async deleteById(workspace_member_id) {
        await WorkspaceMember.findByIdAndDelete(workspace_member_id)
    }
    async getById(workspace_member_id) {
        return await WorkspaceMember.findById(workspace_member_id)
    }
    async updateRoleById(member_id, role) {
        const new_workspace_member = await WorkspaceMember.findByIdAndUpdate(
            member_id,
            {role: role},
            { new: true }
        )
        return new_workspace_member
    }
    async getAll() {
        await WorkspaceMember.find()
    }
    async getMemberList(fk_id_workspace) {

        /* 
        con el metodo populate podemos traer los datos relacionados a las referencias que tenemos en el modelo, en este caso fk_id_user y fk_id_workspace.
        Entonces si quiero traer el nombre de usuario de cada miembro podria hacer un populate de fk_id_user y seleccionar solo el campo name, quedando asi:
        */

        const members = await WorkspaceMember.find({ fk_id_workspace: fk_id_workspace })
        .populate('fk_id_user', 'name email profile_picture public_id')
        
        const members_mapped = members.map(
            (member) => {
                return {
                    member_id: member._id,
                    member_role: member.role,
                    member_status: member.status,
                    member_created_at: member.created_at,
                    
                    user_id: member.fk_id_user._id,
                    user_name: member.fk_id_user.name,
                    user_email: member.fk_id_user.email,
                    user_profile_picture: member.fk_id_user.profile_picture || null,
                    user_public_id: member.fk_id_user.public_id || null
                }
            }
        )
        return members_mapped
    }

    async getWorkspaceListByUserId(user_id){

        //Toda la lista de miembros donde el usuario sea miembro
        const members = await WorkspaceMember.find({fk_id_user: user_id})
        .populate('fk_id_workspace')

        const members_mapped = members.map(
            (member) => {
                return {
                    member_id: member._id,
                    member_role: member.role,
                    member_created_at: member.created_at,
                    
                    workspace_id: member.fk_id_workspace._id,
                    workspace_title: member.fk_id_workspace.title,
                    workspace_description: member.fk_id_workspace.description
                }
            }
        )

        return members_mapped
    }
}
const workspaceMemberRepository = new WorkspaceMemberRepository()
export default workspaceMemberRepository