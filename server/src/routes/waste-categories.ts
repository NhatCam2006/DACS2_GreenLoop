import { Router } from "express";
import { wasteCategoryController } from "../modules/waste-categories/waste-category.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", wasteCategoryController.getAll);
router.get("/:id", wasteCategoryController.getById);

// Admin only routes
router.post("/", authMiddleware(["ADMIN"]), wasteCategoryController.create);
router.put("/:id", authMiddleware(["ADMIN"]), wasteCategoryController.update);
router.delete("/:id", authMiddleware(["ADMIN"]), wasteCategoryController.delete);

export const wasteCategoryRouter = router;

