import mongoose, {Schema, Model, Document} from "mongoose"

interface IGrade extends Document {
    grade: String,
    subjects: mongoose.Types.ObjectId[],
}

const gradeSchema = new Schema<IGrade>({
    grade: {
        type: String,
        required: true,
        unique: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    }],
    
}, {timestamps: true})

export const Grade: Model<IGrade> = mongoose.model<IGrade>('Grade', gradeSchema)
export type { IGrade }