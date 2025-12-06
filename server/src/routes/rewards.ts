import { Router } from "express";
import { rewardController } from "../modules/rewards/reward.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", rewardController.getAll);
router.get("/:id", rewardController.getById);

// User routes
router.post("/redeem", authMiddleware(), rewardController.redeem);

// Admin only routes
router.post("/", authMiddleware(["ADMIN"]), rewardController.create);
router.put("/:id", authMiddleware(["ADMIN"]), rewardController.update);
router.delete("/:id", authMiddleware(["ADMIN"]), rewardController.delete);

export const rewardRouter = router;

