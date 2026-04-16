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
        },
        public_id: {
            type: String,
            unique: true,
            required: true,
            default: () => Math.random().toString(36).substring(2, 10).toUpperCase()
        },
        friends: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],
        muted_friends: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],
        muted_workspaces: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }
        ],
        pending_requests: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],
        blocked_users: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ]
    }
)
//Lo asociamos a la coleccion de usuarios
const User = mongoose.model('User', userSchema)

export default User