import mongoose, { Schema, Model, Document} from 'mongoose'
import { IQuestionType } from './questionType.model'
import { QuestionType } from './questionType.model'
import { Grade } from '../grade/grade.model'
import { Subject } from '../subject/subject.model'
import { Chapter } from '../chapter/chapter.model'



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
        type:  mongoose.Schema.Types.ObjectId, 
        ref: 'Grade',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
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