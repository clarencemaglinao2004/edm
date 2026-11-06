import { z } from "zod";

const productBaseSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required"),
  name: z.string().trim().min(1, "Product name is required"),
  category: z.string().trim().min(1).nullable().optional(),
  price: z.coerce.number().positive("Price must be greater than zero"),
  active: z.boolean().optional(),
});

export const productCreateSchema = productBaseSchema;
export const productUpdateSchema = productBaseSchema.partial();

export type ProductInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  price: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
