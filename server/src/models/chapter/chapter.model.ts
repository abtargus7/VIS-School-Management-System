import mongoose, {Schema, Model, Document} from "mongoose"

interface IChapter extends Document {
    grade: String,
    subject: String,
    chapterName: String,
    bookName?: String
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
    }
}, {timestamps: true})

export const Chapter: Model<IChapter> = mongoose.model<IChapter>('Chapter', chapterSchema)
export type { IChapter }