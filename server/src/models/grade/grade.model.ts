import mongoose, {Schema, Model, Document} from "mongoose"

interface IGrade extends Document {
    grade: String,
    subjects: [String],
}

const gradeSchema = new mongoose.Schema<IGrade>({
    grade: {
        type: String,
        required: true
    },
    subjects: {
        type: [String],
        required: true
    },
    
}, {timestamps: true})

export const Grade: Model<IGrade> = mongoose.model<IGrade>('Grade', gradeSchema)
export type { IGrade }