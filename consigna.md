/* 
Sistema de login y registro
Verificacion de correo electronico de un usuario
Mailing
JWT
Hashear

Un usuario se registra, le enviamos un mail con un link, da click al link DESDE EL MAIL y asi sabemos que su mail esta verificado, ya que para dar click debe estar en su correo electronico
*/


/* 
Desarrollar los sig endpoints:

/api/auth
    POST /register 
    body: {
        email,
        username,
        password
    }

    response: {
        ok: true,
        status: 201,
        message: "Usuario Creado exitosamente"
    }

    Registrar un usuario en la DB
    Validar que el usuario no exista previamente en la DB (con el mismo mail), si existe dar error con status: 400




    POST /login 
    body: {
        email,
        password
    }

    response: {
        ok: true,
        status: 200,
        message: "Usuario logueado exitosamente"
    }

    Si no se encuentra usuario con ese mail: 
    {
        ok: false,
        status: 404,
        message: "Usuario no encontrado"
    }
    
    Si las credenciales no son correctas entonces: 
    {
        ok: false,
        status: 401,
        message: "Credenciales incorrectas"
    }


*/