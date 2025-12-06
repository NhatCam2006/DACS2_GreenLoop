import { z } from "zod";

export const createAddressSchema = z.object({
  street: z.string().min(5),
  ward: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isPrimary: z.boolean().default(false),
  note: z.string().optional(),
  placeHints: z.string().optional(),
  contactName: z.string().optional(),
});

export const updateAddressSchema = z.object({
  street: z.string().min(5).optional(),
  ward: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isPrimary: z.boolean().optional(),
  note: z.string().optional(),
  placeHints: z.string().optional(),
  contactName: z.string().optional(),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

