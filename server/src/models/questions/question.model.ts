import mongoose, { Schema, Model, Document} from 'mongoose'
import { IQuestionType } from './questionType.model'
import { QuestionType } from './questionType.model'

interface IQuestion extends Document {
    _id: String,
    question: String,
    answer?: String
    grade: String,
    subject: String,
    chapter: String,
    questionType: IQuestionType,
    description: String,
    createdAt: Date,
    updatedAt: Date
}

const questionSchema: Schema<IQuestion> = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        unique: true
    },
    answer: {
        type: String,
    },
    grade: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    chapter: {
        type: String,
        required: true
    },
    questionType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionType',
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {timestamps: true}) 

export const Question: Model<IQuestion> = mongoose.model<IQuestion>('Question', questionSchema)
export type { IQuestion }