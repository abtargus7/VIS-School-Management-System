import mongoose, {Schema, Model, Document} from "mongoose"
import { IUser } from '../user/user.model'

interface IChapter extends Document {
    grade: String,
    subject: String,
    chapterName: String,
    bookName?: String,
    createdBy: IUser,
    createdAt: Date,
    updatedAt: Date
}

const chapterSchema: Schema<IChapter> = new mongoose.Schema({
    grade: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    chapterName: {
        type: String,
        required: true
    },
    bookName: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

export const Chapter: Model<IChapter> = mongoose.model<IChapter>('Chapter', chapterSchema)
export type { IChapter }