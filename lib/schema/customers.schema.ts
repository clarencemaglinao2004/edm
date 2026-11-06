import { z } from "zod";

const customerBaseSchema = z.object({
  email: z
    .email("A valid email address is required")
    .transform((value) => value.trim().toLowerCase()),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1).nullable().optional(),
  phone: z.string().trim().min(1).nullable().optional(),
  loyaltyTier: z.string().trim().min(1).optional(),
  consentMarketing: z.boolean().optional(),
});

export const customerCreateSchema = customerBaseSchema;
export const customerUpdateSchema = customerBaseSchema.partial();

export type CustomerInput = z.infer<typeof customerCreateSchema>;
export type CustomersInput = CustomerInput;
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  loyaltyTier: string;
  consentMarketing: boolean;
  createdAt: string;
  updatedAt: string;
}
