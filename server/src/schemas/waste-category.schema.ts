import { z } from "zod";

export const createWasteCategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  pointsPerKg: z.number().min(0),
  iconUrl: z.string().url().optional(),
});

export const updateWasteCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  pointsPerKg: z.number().min(0).optional(),
  iconUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export type CreateWasteCategoryInput = z.infer<typeof createWasteCategorySchema>;
export type UpdateWasteCategoryInput = z.infer<typeof updateWasteCategorySchema>;

