import { Router } from "express";
import { addQuestionType, getAllQuestionTypes, getQuestionTypeById } from "../controlllers/questionType.controller";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Route to add a new question type (Admin only)
router.post("/", verifyJWT, verifyAdmin, addQuestionType);

// Route to get all question types (Authenticated users)
router.get("/", verifyJWT, getAllQuestionTypes);

// Route to get question type by ID (Authenticated users)
router.get("/:id", verifyJWT, getQuestionTypeById);

export default router;

