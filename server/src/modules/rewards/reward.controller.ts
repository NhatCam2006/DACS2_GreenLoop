import { Request, Response, NextFunction } from "express";
import { rewardService } from "./reward.service";
import { createRewardSchema, updateRewardSchema, redeemRewardSchema } from "../../schemas/reward.schema";

export const rewardController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activeOnly = req.query.activeOnly !== "false";
      const rewards = await rewardService.findAll(activeOnly);
      res.json({ rewards });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Reward ID is required" });
      }
      const reward = await rewardService.findById(id);
      res.json({ reward });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = createRewardSchema.parse(req.body);
      const reward = await rewardService.create(payload);
      res.status(201).json({ reward });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Reward ID is required" });
      }
      const payload = updateRewardSchema.parse(req.body);
      const reward = await rewardService.update(id, payload);
      res.json({ reward });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Reward ID is required" });
      }
      await rewardService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  redeem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const payload = redeemRewardSchema.parse(req.body);
      const result = await rewardService.redeem(req.user.id, payload.rewardId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};

