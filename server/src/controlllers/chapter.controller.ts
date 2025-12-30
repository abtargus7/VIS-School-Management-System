import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Chapter } from "../models/chapter/chapter.model";
import { Request,Response } from "express";
import mongoose from "mongoose";

// Add new chapter (Authenticated users)
const addChapter = asyncHandler(async (req: Request, res: Response) => {
    const { grade, subject, chapterName, bookName } = req.body;

    // Validate required fields
    if (!grade || !subject || !chapterName) {
        throw new ApiError(400, "Grade, subject, and chapter name are required");
    }

    // Validate non-empty strings
    if (grade.trim() === "" || subject.trim() === "" || chapterName.trim() === "") {
        throw new ApiError(400, "Grade, subject, and chapter name cannot be empty");
    }

    // Get the authenticated user
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User not authenticated");
    }

    // Check if chapter already exists (same grade, subject, and chapterName combination) for this user
    const existingChapter = await Chapter.findOne({
        grade: grade.trim(),
        subject: subject.trim(),
        chapterName: chapterName.trim(),
        createdBy: req.user._id
    });

    if (existingChapter) {
        throw new ApiError(409, "Chapter already exists for this grade and subject");
    }

    // Create new chapter
    const newChapter = new Chapter({
        grade: grade.trim(),
        subject: subject.trim(),
        chapterName: chapterName.trim(),
        bookName: bookName ? bookName.trim() : undefined,
        createdBy: req.user._id
    });

    const savedChapter = await newChapter.save();
    
    // Populate createdBy for response
    await savedChapter.populate('createdBy');

    return res.status(201).json(
        new ApiResponse(201, savedChapter, "Chapter added successfully")
    );
});

// Get all chapters (Only chapters created by the user, or all if admin)
const getAllChapters = asyncHandler(async (req: Request, res: Response) => {
    // Get the authenticated user
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User not authenticated");
    }

    // If admin, get all chapters; otherwise, get only user's chapters
    const query = req.user.role === 'admin' 
        ? {} 
        : { createdBy: req.user._id };

    const chapters = await Chapter.find(query)
        .populate('createdBy')
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, chapters, "Chapters fetched successfully")
    );
});

// Get chapter by ID (Only if user created it, or if admin)
const getChapterById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid chapter ID");
    }

    // Get the authenticated user
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User not authenticated");
    }

    const chapter = await Chapter.findById(id).populate('createdBy');

    if (!chapter) {
        throw new ApiError(404, "Chapter not found");
    }

    // Check if user is the owner or an admin
    const isOwner = chapter.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "Forbidden: You can only access your own chapters");
    }

    return res.status(200).json(
        new ApiResponse(200, chapter, "Chapter fetched successfully")
    );
});

// Get chapters by grade and subject (Only chapters created by the user, or all if admin)
const getChaptersByGradeAndSubject = asyncHandler(async (req: Request, res: Response) => {
    const { grade, subject } = req.query;

    if (!grade || !subject) {
        throw new ApiError(400, "Grade and subject are required");
    }

    if (typeof grade !== 'string' || typeof subject !== 'string') {
        throw new ApiError(400, "Grade and subject must be strings");
    }

    if (grade.trim() === "" || subject.trim() === "") {
        throw new ApiError(400, "Grade and subject cannot be empty");
    }

    // Get the authenticated user
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User not authenticated");
    }

    // If admin, get all chapters; otherwise, get only user's chapters
    const query: any = {
        grade: grade.trim(),
        subject: subject.trim()
    };

    if (req.user.role !== 'admin') {
        query.createdBy = req.user._id;
    }

    const chapters = await Chapter.find(query)
        .populate('createdBy')
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, chapters, "Chapters fetched successfully")
    );
});

// Update chapter (Owner or Admin only)
const updateChapter = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { grade, subject, chapterName, bookName } = req.body;

    // Validate chapter ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid chapter ID");
    }

    // Get the authenticated user
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User not authenticated");
    }

    // Find the chapter
    const existingChapter = await Chapter.findById(id);
    if (!existingChapter) {
        throw new ApiError(404, "Chapter not found");
    }

    // Check if user is the owner or an admin
    const isOwner = existingChapter.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "Forbidden: You can only update your own chapters");
    }

    // Build update object with only provided fields
    const updateData: any = {};

    if (grade !== undefined) {
        if (grade.trim() === "") {
            throw new ApiError(400, "Grade cannot be empty");
        }
        updateData.grade = grade.trim();
    }

    if (subject !== undefined) {
        if (subject.trim() === "") {
            throw new ApiError(400, "Subject cannot be empty");
        }
        updateData.subject = subject.trim();
    }

    if (chapterName !== undefined) {
        if (chapterName.trim() === "") {
            throw new ApiError(400, "Chapter name cannot be empty");
        }
        updateData.chapterName = chapterName.trim();
    }

    if (bookName !== undefined) {
        updateData.bookName = bookName.trim() === "" ? undefined : bookName.trim();
    }

    // Check for duplicate if grade, subject, or chapterName is being updated
    if (updateData.grade || updateData.subject || updateData.chapterName) {
        const finalGrade = updateData.grade || existingChapter.grade;
        const finalSubject = updateData.subject || existingChapter.subject;
        const finalChapterName = updateData.chapterName || existingChapter.chapterName;

        const duplicateChapter = await Chapter.findOne({
            grade: finalGrade,
            subject: finalSubject,
            chapterName: finalChapterName,
            _id: { $ne: id }
        });

        if (duplicateChapter) {
            throw new ApiError(409, "Chapter already exists for this grade and subject");
        }
    }

    // Update the chapter
    const updatedChapter = await Chapter.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate('createdBy');

    return res.status(200).json(
        new ApiResponse(200, updatedChapter, "Chapter updated successfully")
    );
});

// Delete chapter (Owner or Admin only)
const deleteChapter = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate chapter ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid chapter ID");
    }

    // Get the authenticated user
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User not authenticated");
    }

    // Find the chapter
    const existingChapter = await Chapter.findById(id);
    if (!existingChapter) {
        throw new ApiError(404, "Chapter not found");
    }

    // Check if user is the owner or an admin
    const isOwner = existingChapter.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "Forbidden: You can only delete your own chapters");
    }

    const chapterId = existingChapter._id;
    await Chapter.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, { id: chapterId }, "Chapter deleted successfully")
    );
});

export { 
    addChapter, 
    getAllChapters, 
    getChapterById, 
    getChaptersByGradeAndSubject,
    updateChapter, 
    deleteChapter 
};

