import { Router } from "express";
import { registerUser, loginUser } from "../controlllers/user.controller";
import { verifyAdmin } from "@/middlewares/auth.middleware";

const router = Router();

// Route to register a new user (Public - no auth required)
router.post("/register", verifyAdmin, registerUser);

// Route to login user (Public - no auth required)
router.post("/login", loginUser);

export default router;

