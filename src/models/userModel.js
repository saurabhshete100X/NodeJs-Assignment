const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
            },

        username: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            enum: ['superadmin', 'admin', 'user'],
            default: 'user'
        },
        status: {
            type: String,
            enum: ['active', 'deactivated', 'unverified'],
            default: 'unverified'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date
        }

    }, { timestamps: true }

)

module.exports = mongoose.model("user", userSchema)



