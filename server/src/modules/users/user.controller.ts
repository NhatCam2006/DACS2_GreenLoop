import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";

export const userController = {
  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = await userService.findById(req.user.id);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },

  // Update current user profile
  updateMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { fullName, phone } = req.body;
      const user = await userService.updateProfile(req.user.id, {
        fullName,
        phone,
      });
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },

  // Change password
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Current and new password are required" });
      }
      await userService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  },

  // List all users (admin only)
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden - Admin access only" });
      }
      const users = await userService.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  // Update user status (admin only)
  toggleStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden - Admin access only" });
      }

      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await userService.toggleStatus(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
};
