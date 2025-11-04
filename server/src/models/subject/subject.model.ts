import mongoose, {Schema, Model, Document} from "mongoose";

interface ISubject extends Document {
    _id: String,
    name: String,
    description: String,
    createdAt: Date,
    updatedAt: Date
}

const subjectSchema: Schema<ISubject> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const Subject: Model<ISubject> = mongoose.model<ISubject>("Subject", subjectSchema)

export type { ISubject }