import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { QuestionType } from "../models/questions/questionType.model";
import { Request,Response } from "express";
import mongoose from "mongoose";

// Add new question type (Admin only)
const addQuestionType = asyncHandler( async(req: Request, res: Response) => {
    const { name, description } = req.body

    if(!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    if(name.trim() === "" || description.trim() === "") {
        throw new ApiError(400, "Name and description cannot be empty")
    }

    // Check if question type already exists
    const existingQuestionType = await QuestionType.findOne({ name: name.trim() })

    if(existingQuestionType) {
        throw new ApiError(409, "Question type already exists")
    }

    const newQuestionType = new QuestionType({
        name: name.trim(),
        description: description.trim()
    })

    const savedQuestionType = await newQuestionType.save()

    return res.status(201).json(
        new ApiResponse(201, savedQuestionType, "Question type added successfully")
    )
})

// Get all question types (for selecting when creating questions)
const getAllQuestionTypes = asyncHandler( async(req: Request, res: Response) => {
    const questionTypes = await QuestionType.find({}).sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, questionTypes, "Question types fetched successfully")
    )
})

// Get question type by ID
const getQuestionTypeById = asyncHandler( async(req: Request, res: Response) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid question type ID")
    }

    const questionType = await QuestionType.findById(id)

    if(!questionType) {
        throw new ApiError(404, "Question type not found")
    }

    return res.status(200).json(
        new ApiResponse(200, questionType, "Question type fetched successfully")
    )
})

export { addQuestionType, getAllQuestionTypes, getQuestionTypeById }

