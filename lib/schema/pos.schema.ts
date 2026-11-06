import { z } from "zod";

export const posLineSchema = z.object({
  productId: z.uuid("A valid product id is required"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
});

export const posTransactionCreateSchema = z.object({
  email: z
    .email("A valid email address is required")
    .transform((value) => value.trim().toLowerCase())
    .nullable()
    .optional(),
  items: z.array(posLineSchema).min(1, "At least one item is required").max(100),
});

export type PosLineInput = z.infer<typeof posLineSchema>;
export type PosTransactionInput = z.infer<typeof posTransactionCreateSchema>;

export interface PosTransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  product?: {
    sku: string;
    name: string;
  };
}

export interface PosTransaction {
  id: string;
  customerId: string | null;
  email: string | null;
  total: string;
  occurredAt: string;
  createdAt: string;
  items?: PosTransactionItem[];
}
