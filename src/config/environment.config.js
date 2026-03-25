import dotenv from 'dotenv'

dotenv.config()

const ENVIRONMENT = {
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    PORT: process.env.PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    URL_BACKEND: process.env.URL_BACKEND,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}

export default ENVIRONMENT