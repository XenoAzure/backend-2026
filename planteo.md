## Ver detalle de espacio de trabajo
- Ver titulo de espacio de trabajo
- Ver lista de miembros

## Backend

Necesita auth? Si
Tambien hay que verificar si el usuario es parte de ese workspace => verifyMemberWorkspaceMiddleware()
verifyMemberWorkspaceMiddleware() Checkeara si el usuario pertenece al espacio de trabajo y guardara los datos de membresia en la request


GET /api/workspace/:workspace_id

Headers: {
    authorization: `Bearer ${token}`
}

Response: {
    ok: true,
    status: 200,
    message: "Datos del espacio de trabajo obtenidos'
    data: {
        workspace: {
            _id,
            title,
            description,
            url_image
        },
        members: [
            {
                member_id,
                member_role,
                member_created_at,
                user_id,
                user_name,
                user_email
            }
        ]
    }
}

## Frontend


## Canales
## Backend

POST /api/workspace/:workspace_id/channel
Middlewares: 
    - auth
    - verifyWorkspaceMiddleware
    - verifyMember (Configurar rol si se desea)
body: {
    title,
    description
}

GET /api/workspace/:workspace_id/channel
Middlewares: 
    - auth
    - verifyWorkspaceMiddleware
    - verifyMember (Configurar rol si se desea)

DELETE /api/workspace/:workspace_id/channel/:channel_id
Middlewares: 
    - auth
    - verifyWorkspaceMiddleware
    - verifyMember (Configurar rol si se desea)
    - verifyChannelMiddleware

## Miembros

POST /api/workspace/:workspace_id/member
Crear un miembro
body: {
    email: email del invitado,
    role: 'user' | 'admin'
}
OPCIONAL (Recomendada): 
    Que sea una invitacion (que el usuario pueda aceptar o declinar) y en caso de aceptar pueda entrar

    POST /api/workspace/:workspace_id/member/invite
    Crean el miembro como invitado (acceptInvitation: 'pending', 'accepted', 'rejected') y enviamos un mail con 2 links (cada uno con su token y la accion aceptar o rechazar) al usuario invitado.
    Si el usuario da click en el link que tiene el token enviara un get al backend donde se pasara el acceptInvitation a 'accepted' o 'rejected'.
    body: {
        email: email del invitado,
        role: 'user' | 'admin'
    }

    GET /api/workspace/:workspace_id/member/?token=ey
    dentro del token estara el action con 'accepted' o 'rejected'
    Revisar si el miembro esta en pendiente, si esta en algo DISTINTO A PENDIENTE NO DEJAR QUE LA ACCION CAMBIE AL MIEMBRO, debido a que este ya tomo una decision.

DELETE /api/workspace/:workspace_id/member/:member_id 
    Solo debe poder eliminar el dueño, administrador el mismo usuario
    Un administrador NO puede eliminar a un dueño

PUT /api/workspace/:workspace_id/member/:member_id 
    Solo admins y dueños pueden actualizar el role de otros miembros, excepto el suyo. 
    Admin no puede actualizar a dueño
    NO se puede actualizar a 'owner'
    body: {
        role: 'admin' | 'user'
    }

GET /api/workspace/:workspace_id/member
    Obtener lista de miembros

## Mensajes
POST /api/workspace/:workspace_id/channel/:channel_id/message
    Solo un miembro del espacio de trabajo puede crear un mensaje
    body: {
        content
    }

GET /api/workspace/:workspace_id/channel/:channel_id/message
    Obtener lista de mensajes
