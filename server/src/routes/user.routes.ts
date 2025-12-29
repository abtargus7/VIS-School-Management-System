import { Router } from "express";
import { registerUser, loginUser } from "../controlllers/user.controller";

const router = Router();

// Route to register a new user (Public - no auth required)
router.post("/register", registerUser);

// Route to login user (Public - no auth required)
router.post("/login", loginUser);

export default router;

