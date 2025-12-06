import { Request, Response, NextFunction } from "express";
import { transactionService } from "./transaction.service";

export const transactionController = {
  getMyTransactions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await transactionService.findByUserId(req.user.id, limit);
      const balance = await transactionService.getBalance(req.user.id);
      res.json({ transactions, balance });
    } catch (error) {
      next(error);
    }
  },
};

