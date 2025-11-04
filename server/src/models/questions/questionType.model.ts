import mongoose, { Schema, Model, Document} from 'mongoose'

interface IQuestionType extends Document {
    _id: String,
    name: String,
    description: String,
    createdAt: Date,
    updatedAt: Date
}

const questionSchema: Schema<IQuestionType> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {timestamps: true}) 

export const Question: Model<IQuestionType> = mongoose.model<IQuestionType>('Question', questionSchema)
export type { IQuestionType }