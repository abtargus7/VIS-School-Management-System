import mongoose, { Schema, Model, Document} from 'mongoose'
import { IQuestionType } from './questionType.model'
import { IGrade } from '../grade/grade.model'
import { ISubject } from '../subject/subject.model'
import { IChapter } from '../chapter/chapter.model'
import { IUser } from '../user/user.model'

interface IQuestion extends Document {
    _id: String,
    question: String,
    answer?: String
    grade: IGrade,
    subject: ISubject,
    chapter: IChapter,
    questionType: IQuestionType,
    description: String,
    createdBy: IUser,
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
        type: mongoose.Schema.Types.ObjectId,
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
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true}) 

export const Question: Model<IQuestion> = mongoose.model<IQuestion>('Question', questionSchema)
export type { IQuestion }