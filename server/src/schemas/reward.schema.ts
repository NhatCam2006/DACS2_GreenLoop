import { z } from "zod";

export const createRewardSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  pointsCost: z.number().min(1),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0).default(0),
});

export const updateRewardSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  pointsCost: z.number().min(1).optional(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const redeemRewardSchema = z.object({
  rewardId: z.string().uuid(),
});

export type CreateRewardInput = z.infer<typeof createRewardSchema>;
export type UpdateRewardInput = z.infer<typeof updateRewardSchema>;
export type RedeemRewardInput = z.infer<typeof redeemRewardSchema>;

