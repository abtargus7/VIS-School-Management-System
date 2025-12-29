import mongoose, { Schema, Model, Document } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

interface IUser extends Document {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    role?: string;
    accessToken?: string;
    createdAt: Date;
    updatedAt: Date;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({

    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    accessToken: {
        type: String
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET as string
    )
}

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)
export type { IUser };