import { Router } from "express";
import { notificationController } from "../modules/notifications/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware());

// Get all notifications for current user
router.get("/", notificationController.getMyNotifications);

// Get unread count
router.get("/unread-count", notificationController.getUnreadCount);

// Mark all as read
router.post("/mark-all-read", notificationController.markAllAsRead);

// Mark single notification as read
router.patch("/:id/read", notificationController.markAsRead);

// Delete a notification
router.delete("/:id", notificationController.delete);

export default router;
