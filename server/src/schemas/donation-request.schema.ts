import { z } from "zod";

export const createDonationRequestSchema = z.object({
  wasteCategoryId: z.string().uuid(),
  estimatedWeight: z.number().min(0.1),
  imageUrls: z.array(z.string().url()).optional().default([]),
  addressId: z.string().uuid(),
  notes: z.string().optional(),
  preferredDate: z.string().optional(),
});

export const updateDonationRequestSchema = z.object({
  estimatedWeight: z.number().min(0.1).optional(),
  imageUrls: z.array(z.string().url()).optional(),
  notes: z.string().optional(),
  preferredDate: z.string().datetime().optional(),
});

export const acceptDonationRequestSchema = z.object({
  donationRequestId: z.string().uuid(),
});

export const completeDonationRequestSchema = z.object({
  actualWeight: z.number().min(0.1),
  verificationNotes: z.string().optional(),
  verificationImages: z.array(z.string().url()).optional(),
  verificationCode: z.string().length(6),
});

export type CreateDonationRequestInput = z.infer<
  typeof createDonationRequestSchema
>;
export type UpdateDonationRequestInput = z.infer<
  typeof updateDonationRequestSchema
>;
export type AcceptDonationRequestInput = z.infer<
  typeof acceptDonationRequestSchema
>;
export type CompleteDonationRequestInput = z.infer<
  typeof completeDonationRequestSchema
>;
