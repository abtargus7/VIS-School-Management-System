import { Router } from "express";
import { addGrade, getAllGrades, getGradeById } from "../controlllers/grade.controller";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Route to get all grades (Admin only)
router.get("/", verifyJWT, verifyAdmin, getAllGrades);

// Route to get grade by ID (Admin only)
router.get("/:id", verifyJWT, verifyAdmin, getGradeById);

// Route to add a new grade (Admin only)
router.post("/", verifyJWT, verifyAdmin, addGrade);

export default router;

