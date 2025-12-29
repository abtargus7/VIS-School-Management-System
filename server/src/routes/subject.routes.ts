import { Router } from "express";
import { addSubject, getAllSubjects } from "../controlllers/subject.controller";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Route to add a new subject (Admin only)
router.post("/", verifyJWT, verifyAdmin, addSubject);

// Route to get all subjects (Admin only - for selecting when creating grade)
router.get("/", verifyJWT, getAllSubjects);

export default router;

