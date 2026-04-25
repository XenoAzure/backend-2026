# Cobalt Backend - API Documentation

Este es el servidor backend para la aplicación Cobalt, una plataforma de comunicación similar a Slack diseñada para la gestión de workspaces, canales, mensajes y tareas.

## Tecnologías Utilizadas

- **Node.js** & **Express** (Runtime y Framework)
- **MongoDB** & **Mongoose** (Base de datos NoSQL y ODM)
- **JSON Web Tokens (JWT)** (Autenticación)
- **Nodemailer** (Envío de correos electrónicos)
- **CORS** (Seguridad de origen cruzado)
- **Bcrypt** (Hashing de contraseñas)

## Configuración del Entorno

Para ejecutar este proyecto localmente, crea un archivo `.env` en la raíz del directorio `/backend` basándote en el siguiente ejemplo:

```env
PORT=8080
MONGO_DB_CONNECTION_STRING=tu_cadena_de_conexion_mongodb
MAIL_PASSWORD=tu_app_password_de_gmail
MAIL_USER=tu_correo_gmail
URL_BACKEND=http://localhost:8080
JWT_SECRET_KEY=una_clave_secreta_muy_segura
URL_FRONTEND=http://localhost:5173
```

## Instalación y Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

---

## Documentación de Endpoints

Todas las rutas base están bajo `/api`.

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Cuerpo (JSON) |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Registra un nuevo usuario | `name`, `email`, `password` |
| POST | `/login` | Inicia sesión y devuelve un JWT | `email`, `password` |
| GET | `/verify-email` | Verifica la cuenta vía token de correo | Query: `?verify_email_token=...` |
| POST | `/reset-password-request` | Solicita recuperación de contraseña | `email` |
| POST | `/reset-password/:token` | Establece nueva contraseña | `password` |

### Usuario (`/api/user`) - *Requiere Auth*

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/me` | Obtiene el perfil del usuario autenticado |
| PATCH | `/me` | Actualiza datos del perfil (bio, imagen, etc) |
| POST | `/friends` | Envía solicitud de amistad vía `public_id` |
| DELETE | `/friends/:friend_id` | Elimina a un amigo |
| POST | `/friends/requests/:id/accept` | Acepta solicitud de amistad |
| POST | `/friends/requests/:id/decline` | Rechaza solicitud de amistad |

###  Workspaces (`/api/workspace`) - *Requiere Auth*

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/` | Lista los workspaces del usuario |
| POST | `/` | Crea un nuevo workspace |
| GET | `/:workspace_id` | Obtiene detalles de un workspace |
| PUT | `/:workspace_id` | Actualiza workspace (Solo Owner/Admin) |
| DELETE | `/:workspace_id` | Elimina workspace (Solo Owner) |

### Canales y Mensajes - *Requiere Auth*

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/workspace/:id/channel` | Lista canales de un workspace |
| POST | `/workspace/:id/channel` | Crea un canal |
| GET | `/workspace/:id/channel/:ch_id/message` | Obtiene mensajes de un canal |
| POST | `/workspace/:id/channel/:ch_id/message` | Envía mensaje a un canal |
| GET | `/dm/:friend_id` | Obtiene chat privado con un amigo |
| POST | `/dm/:friend_id` | Envía mensaje directo |

### Tareas (`/api/workspace/:id/task`) - *Requiere Auth*

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/` | Lista tareas del workspace |
| POST | `/` | Crea una tarea (Solo Owner/Admin) |
| PUT | `/:task_id` | Actualiza estado/datos de tarea |
| DELETE | `/:task_id` | Elimina tarea |

---

## Manejo de Errores

El servidor utiliza un middleware centralizado para respuestas consistentes:

```json
{
  "ok": false,
  "status": 400,
  "message": "Descripción del error"
}
```
