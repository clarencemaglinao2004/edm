import { z } from "zod";

import type { Customer } from "./customers.schema";
import type { Shipment } from "./shipments.schema";

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const orderLineSchema = z.object({
  productId: z.uuid("A valid product id is required"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
});

export const orderCreateSchema = z.object({
  customerId: z.uuid("A valid customer id is required"),
  items: z.array(orderLineSchema).min(1, "At least one item is required").max(100),
});

export const orderStatusUpdateSchema = z.object({
  status: orderStatusSchema,
});

export type OrderLineInput = z.infer<typeof orderLineSchema>;
export type OrderInput = z.infer<typeof orderCreateSchema>;
export type OrderStatusInput = z.infer<typeof orderStatusUpdateSchema>;

export interface StorefrontOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  product?: {
    sku: string;
    name: string;
  };
}

export interface StorefrontOrder {
  id: string;
  customerId: string;
  status: OrderStatus;
  total: string;
  placedAt: string;
  createdAt: string;
  updatedAt: string;
  items?: StorefrontOrderItem[];
  customer?: Customer;
  shipments?: Shipment[];
}
