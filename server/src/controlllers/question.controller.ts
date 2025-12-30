import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Question } from "../models/questions/question.model";
import { QuestionType } from "../models/questions/questionType.model";
import { Grade } from "../models/grade/grade.model";
import { Subject } from "../models/subject/subject.model";
import { Chapter } from "../models/chapter/chapter.model";
import { IRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import mongoose from "mongoose";

// Add new question (Authenticated users)
const addQuestion = asyncHandler(async (req: IRequest, res: Response) => {
    const { question, answer, grade, subject, chapter, questionType, description } = req.body;

    // Validate required fields
    if (!question || !grade || !subject || !chapter || !questionType || !description) {
        throw new ApiError(400, "Question, grade, subject, chapter, questionType, and description are required");
    }

    // Validate question and description are non-empty strings
    if (question.trim() === "" || description.trim() === "") {
        throw new ApiError(400, "Question and description cannot be empty");
    }

    // Validate all ObjectIds
    if (!mongoose.Types.ObjectId.isValid(grade)) {
        throw new ApiError(400, "Invalid grade ID");
    }
    if (!mongoose.Types.ObjectId.isValid(subject)) {
        throw new ApiError(400, "Invalid subject ID");
    }
    if (!mongoose.Types.ObjectId.isValid(chapter)) {
        throw new ApiError(400, "Invalid chapter ID");
    }
    if (!mongoose.Types.ObjectId.isValid(questionType)) {
        throw new ApiError(400, "Invalid question type ID");
    }

    // Check if grade exists
    const existingGrade = await Grade.findById(grade);
    if (!existingGrade) {
        throw new ApiError(404, "Grade not found");
    }

    // Check if subject exists
    const existingSubject = await Subject.findById(subject);
    if (!existingSubject) {
        throw new ApiError(404, "Subject not found");
    }

    // Check if chapter exists
    const existingChapter = await Chapter.findById(chapter);
    if (!existingChapter) {
        throw new ApiError(404, "Chapter not found");
    }

    // Check if question type exists
    const existingQuestionType = await QuestionType.findById(questionType);
    if (!existingQuestionType) {
        throw new ApiError(404, "Question type not found");
    }

    // Check if question already exists (since question is unique)
    const existingQuestion = await Question.findOne({ question: question.trim() });
    if (existingQuestion) {
        throw new ApiError(409, "Question already exists");
    }

    // Get the authenticated user
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User not authenticated");
    }

    // Create new question
    const newQuestion = new Question({
        question: question.trim(),
        answer: answer ? answer.trim() : undefined,
        grade: grade,
        subject: subject,
        chapter: chapter,
        questionType: questionType,
        description: description.trim(),
        createdBy: req.user._id
    });

    const savedQuestion = await newQuestion.save();
    
    // Populate all referenced fields for response
    await savedQuestion.populate(['grade', 'subject', 'chapter', 'questionType', 'createdBy']);

    return res.status(201).json(
        new ApiResponse(201, savedQuestion, "Question added successfully")
    );
});

// Update question (Owner or Admin only)
const updateQuestion = asyncHandler(async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const { question, answer, grade, subject, chapter, questionType, description } = req.body;

    // Validate question ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid question ID");
    }

    // Get the authenticated user
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User not authenticated");
    }

    // Find the question
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
        throw new ApiError(404, "Question not found");
    }

    // Check if user is the owner or an admin
    const isOwner = existingQuestion.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "Forbidden: You can only update your own questions");
    }

    // Build update object with only provided fields
    const updateData: any = {};

    if (question !== undefined) {
        if (question.trim() === "") {
            throw new ApiError(400, "Question cannot be empty");
        }
        // Check if the new question text conflicts with another question
        const duplicateQuestion = await Question.findOne({ 
            question: question.trim(),
            _id: { $ne: id }
        });
        if (duplicateQuestion) {
            throw new ApiError(409, "Question already exists");
        }
        updateData.question = question.trim();
    }

    if (answer !== undefined) {
        updateData.answer = answer.trim() === "" ? undefined : answer.trim();
    }

    if (grade !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(grade)) {
            throw new ApiError(400, "Invalid grade ID");
        }
        // Check if grade exists
        const existingGrade = await Grade.findById(grade);
        if (!existingGrade) {
            throw new ApiError(404, "Grade not found");
        }
        updateData.grade = grade;
    }

    if (subject !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(subject)) {
            throw new ApiError(400, "Invalid subject ID");
        }
        // Check if subject exists
        const existingSubject = await Subject.findById(subject);
        if (!existingSubject) {
            throw new ApiError(404, "Subject not found");
        }
        updateData.subject = subject;
    }

    if (chapter !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(chapter)) {
            throw new ApiError(400, "Invalid chapter ID");
        }
        // Check if chapter exists
        const existingChapter = await Chapter.findById(chapter);
        if (!existingChapter) {
            throw new ApiError(404, "Chapter not found");
        }
        updateData.chapter = chapter;
    }

    if (questionType !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(questionType)) {
            throw new ApiError(400, "Invalid question type ID");
        }
        // Check if question type exists
        const existingQuestionType = await QuestionType.findById(questionType);
        if (!existingQuestionType) {
            throw new ApiError(404, "Question type not found");
        }
        updateData.questionType = questionType;
    }

    if (description !== undefined) {
        if (description.trim() === "") {
            throw new ApiError(400, "Description cannot be empty");
        }
        updateData.description = description.trim();
    }

    // Update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate(['grade', 'subject', 'chapter', 'questionType', 'createdBy']);

    return res.status(200).json(
        new ApiResponse(200, updatedQuestion, "Question updated successfully")
    );
});

// Delete question (Owner or Admin only)
const deleteQuestion = asyncHandler(async (req: IRequest, res: Response) => {
    const { id } = req.params;

    // Validate question ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid question ID");
    }

    // Get the authenticated user
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User not authenticated");
    }

    // Find the question
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
        throw new ApiError(404, "Question not found");
    }

    // Check if user is the owner or an admin
    const isOwner = existingQuestion.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "Forbidden: You can only delete your own questions");
    }

    // Delete the question
    const questionId = existingQuestion._id;
    await Question.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, { id: questionId }, "Question deleted successfully")
    );
});

export { addQuestion, updateQuestion, deleteQuestion };

