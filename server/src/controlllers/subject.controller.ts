import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Subject } from "../models/subject/subject.model";
import { Request,Response } from "express";

// Add new subject (Admin only)
const addSubject = asyncHandler( async(req: Request, res: Response) => {
    const { name, description } = req.body

    if(!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    if(name.trim() === "" || description.trim() === "") {
        throw new ApiError(400, "Name and description cannot be empty")
    }

    // Check if subject already exists
    const existingSubject = await Subject.findOne({ name: name.trim() })

    if(existingSubject) {
        throw new ApiError(409, "Subject already exists")
    }

    const newSubject = new Subject({
        name: name.trim(),
        description: description.trim()
    })

    const savedSubject = await newSubject.save()

    return res.status(201).json(
        new ApiResponse(201, savedSubject, "Subject added successfully")
    )
})

// Get all subjects (for admin to select when creating grade)
const getAllSubjects = asyncHandler( async(req: Request, res: Response) => {
    const subjects = await Subject.find({}).sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, subjects, "Subjects fetched successfully")
    )
})

export { addSubject, getAllSubjects }

