import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Grade } from "../models/grade/grade.model";
import { Subject } from "../models/subject/subject.model";      
import { Request,Response } from "express";
import mongoose from "mongoose";

// Add new grade (Admin only)
const addGrade = asyncHandler( async(req: Request, res: Response) => {
    const { grade, subjects } = req.body

    if(!grade || !subjects) {
        throw new ApiError(400, "Grade and subjects are required")
    }

    if(!Array.isArray(subjects)) {
        throw new ApiError(400, "Subjects must be an array")
    }

    if(subjects.length === 0) {
        throw new ApiError(400, "At least one subject is required")
    }

    // Check if grade already exists
    const existingGrade = await Grade.findOne({ grade: grade.trim() })

    if(existingGrade) {
        throw new ApiError(409, "Grade already exists")
    }

    // Validate that all subject IDs exist
    const subjectIds = subjects.map((subjectId: string) => {
        if(!mongoose.Types.ObjectId.isValid(subjectId)) {
            throw new ApiError(400, `Invalid subject ID: ${subjectId}`)
        }
        return new mongoose.Types.ObjectId(subjectId)
    })

    // Check if all subjects exist in the database
    const existingSubjects = await Subject.find({ 
        _id: { $in: subjectIds } 
    })

    if(existingSubjects.length !== subjectIds.length) {
        throw new ApiError(404, "One or more subjects not found")
    }

    const newGrade = new Grade({
        grade: grade.trim(),
        subjects: subjectIds
    })

    const savedGrade = await newGrade.save()

    // Populate subjects before returning
    const populatedGrade = await Grade.findById(savedGrade._id).populate('subjects')

    return res.status(201).json(
        new ApiResponse(201, populatedGrade, "Grade added successfully")
    )
})

// Get all grades
const getAllGrades = asyncHandler( async(req: Request, res: Response) => {
    const grades = await Grade.find({}).populate('subjects').sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, grades, "Grades fetched successfully")
    )
})

// Get grade by ID
const getGradeById = asyncHandler( async(req: Request, res: Response) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid grade ID")
    }

    const grade = await Grade.findById(id).populate('subjects')

    if(!grade) {
        throw new ApiError(404, "Grade not found")
    }

    return res.status(200).json(
        new ApiResponse(200, grade, "Grade fetched successfully")
    )
})

export { addGrade, getAllGrades, getGradeById }

