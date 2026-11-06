import { z } from "zod";

export const CHANNELS = ["POS", "WAREHOUSE", "STOREFRONT"] as const;

export type Channel = (typeof CHANNELS)[number];

export const channelSchema = z.enum(CHANNELS);

export const inventoryUpsertSchema = z.object({
  productId: z.uuid("A valid product id is required"),
  channel: channelSchema,
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  location: z.string().trim().min(1).nullable().optional(),
});

export const inventoryAdjustSchema = z.object({
  productId: z.uuid("A valid product id is required"),
  channel: channelSchema,
  delta: z.coerce.number().int(),
});

export type InventoryInput = z.infer<typeof inventoryUpsertSchema>;
export type InventoryAdjustInput = z.infer<typeof inventoryAdjustSchema>;

export interface InventoryItem {
  id: string;
  channel: Channel;
  quantity: number;
  location: string | null;
  productId: string;
  updatedAt: string;
  product?: {
    sku: string;
    name: string;
  };
}
