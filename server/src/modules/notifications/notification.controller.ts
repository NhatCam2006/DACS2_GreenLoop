import { Request, Response, NextFunction } from "express";
import { notificationService } from "./notification.service";

export const notificationController = {
  /**
   * Get all notifications for current user
   */
  getMyNotifications: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const notifications = await notificationService.findByUserId(
        userId,
        limit
      );
      const unreadCount = await notificationService.getUnreadCount(userId);

      res.json({ notifications, unreadCount });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get unread count
   */
  getUnreadCount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const count = await notificationService.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "Notification ID is required" });
      }

      await notificationService.markAsRead(id, userId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      await notificationService.markAllAsRead(userId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a notification
   */
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "Notification ID is required" });
      }

      await notificationService.delete(id, userId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};
