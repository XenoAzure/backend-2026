import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        email_verified: {
            type: Boolean,
            default: false,
            required: true
        },
        created_at: {
            type: Date,
            required: true,
            default: Date.now
        },
        profile_picture: {
            type: String,
            required: false,
            default: ''
        },
        bio: {
            type: String,
            required: false,
            default: '',
            maxLength: 300
        },
        social_links: {
            twitter: { type: String, default: '' },
            youtube: { type: String, default: '' },
            github: { type: String, default: '' },
            steam: { type: String, default: '' }
        }
    }
)
//Lo asociamos a la coleccion de usuarios
const User = mongoose.model('User', userSchema)

export default User