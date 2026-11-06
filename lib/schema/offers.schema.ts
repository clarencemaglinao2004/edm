import { z } from "zod";

const isoDateSchema = z
  .string()
  .min(1, "A date is required")
  .refine((value) => !Number.isNaN(Date.parse(value)), "A valid date is required");

export const OFFER_STATUSES = ["DRAFT", "ACTIVE", "PAUSED", "EXPIRED"] as const;

export type OfferStatus = (typeof OFFER_STATUSES)[number];

export const offerStatusSchema = z.enum(OFFER_STATUSES);

const offerBaseSchema = z.object({
  productId: z.uuid("A valid product id is required"),
  code: z.string().trim().min(1, "Offer code is required"),
  title: z.string().trim().min(1, "Title is required"),
  discountPct: z.coerce.number().int().min(1).max(100),
  startsAt: isoDateSchema,
  endsAt: isoDateSchema,
  status: offerStatusSchema.optional(),
});

export const offerCreateSchema = offerBaseSchema.refine(
  (value) => new Date(value.startsAt).getTime() < new Date(value.endsAt).getTime(),
  { message: "endsAt must be after startsAt", path: ["endsAt"] },
);

export const offerUpdateSchema = offerBaseSchema.partial().refine(
  (value) =>
    !value.startsAt ||
    !value.endsAt ||
    new Date(value.startsAt).getTime() < new Date(value.endsAt).getTime(),
  { message: "endsAt must be after startsAt", path: ["endsAt"] },
);

export type OfferInput = z.infer<typeof offerCreateSchema>;
export type OfferUpdateInput = z.infer<typeof offerUpdateSchema>;

export interface Offer {
  id: string;
  productId: string;
  code: string;
  title: string;
  discountPct: number;
  startsAt: string;
  endsAt: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  product?: {
    sku: string;
    name: string;
  };
}
