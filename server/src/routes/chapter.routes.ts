import { Router } from "express";
import { 
    addChapter, 
    getAllChapters, 
    getChapterById, 
    getChaptersByGradeAndSubject,
    updateChapter, 
    deleteChapter 
} from "../controlllers/chapter.controller";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Route to add a new chapter (Authenticated users)
router.post("/", verifyJWT, addChapter);

// Route to get all chapters (Authenticated users)
router.get("/", verifyJWT, getAllChapters);

// Route to get chapters by grade and subject (Authenticated users)
router.get("/filter", verifyJWT, getChaptersByGradeAndSubject);

// Route to get chapter by ID (Authenticated users)
router.get("/:id", verifyJWT, getChapterById);

// Route to update a chapter (Owner or Admin only)
router.put("/:id", verifyJWT, updateChapter);

// Route to delete a chapter (Owner or Admin only)
router.delete("/:id", verifyJWT, deleteChapter);

export default router;

