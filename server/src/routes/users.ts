import { Router } from "express";
import { userController } from "../modules/users/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware(), userController.me);
router.put("/me", authMiddleware(), userController.updateMe);
router.put("/me/password", authMiddleware(), userController.changePassword);
router.get("/", authMiddleware(), userController.list); // List all users (admin only)
router.patch(
  "/:userId/toggle-status",
  authMiddleware(),
  userController.toggleStatus
); // Toggle user status (admin only)

export const userRouter = router;
