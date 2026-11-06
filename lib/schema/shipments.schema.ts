import { z } from "zod";

import type { StorefrontOrder } from "./orders.schema";

export const SHIPMENT_STATUSES = [
  "PENDING",
  "IN_TRANSIT",
  "DELIVERED",
  "FAILED",
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const shipmentStatusSchema = z.enum(SHIPMENT_STATUSES);

export const shipmentCreateSchema = z.object({
  orderId: z.uuid("A valid order id is required"),
  carrier: z.string().trim().min(1, "Carrier is required"),
});

export const shipmentUpdateSchema = z.object({
  status: shipmentStatusSchema,
  trackingNumber: z.string().trim().min(1).nullable().optional(),
});

export type ShipmentInput = z.infer<typeof shipmentCreateSchema>;
export type ShipmentUpdateInput = z.infer<typeof shipmentUpdateSchema>;

export interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string | null;
  status: ShipmentStatus;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  order?: StorefrontOrder;
}
