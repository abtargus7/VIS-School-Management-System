import mongoose, { Schema, Model, Document} from 'mongoose'

interface IQuestionType extends Document {
    _id: String,
    name: String,
    description: String,
    createdAt: Date,
    updatedAt: Date
}

const questionTypeSchema: Schema<IQuestionType> = new mongoose.Schema({
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

export const QuestionType: Model<IQuestionType> = mongoose.model<IQuestionType>('QuestionType', questionTypeSchema)
export type { IQuestionType }