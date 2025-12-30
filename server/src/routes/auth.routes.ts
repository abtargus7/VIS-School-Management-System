import { me } from "@/controlllers/auth.controller";
import { verifyJWT } from "@/middlewares/auth.middleware";
import Router from "express";

const router = Router();

router.get("/me", verifyJWT, me);

export default router;
