import { Router } from "express";
import { addQuestion, updateQuestion, deleteQuestion } from "../controlllers/question.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

// Route to add a new question (Authenticated users)
router.post("/", verifyJWT, addQuestion);

// Route to update a question (Owner or Admin only)
router.put("/:id", verifyJWT, updateQuestion);

// Route to delete a question (Owner or Admin only)
router.delete("/:id", verifyJWT, deleteQuestion);

export default router;

