import { Router } from "express";
import { transactionController } from "../modules/transactions/transaction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/my-transactions", authMiddleware(), transactionController.getMyTransactions);

export const transactionRouter = router;

