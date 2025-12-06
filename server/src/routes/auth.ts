import { Router } from "express";
import { authController } from "../modules/auth/auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

export const authRouter = router;

