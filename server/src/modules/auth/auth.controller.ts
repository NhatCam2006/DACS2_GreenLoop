import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { loginSchema, registerSchema } from "../../schemas/auth.schema";

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = registerSchema.parse(req.body);
      const result = await authService.register(payload);
      res.status(201).json({
        user: {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.fullName,
          role: result.user.role,
        },
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await authService.login(payload);
      res.json({
        user: {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.fullName,
          role: result.user.role,
        },
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  },
};

