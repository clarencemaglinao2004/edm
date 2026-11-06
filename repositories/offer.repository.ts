import { prisma } from "@/lib/prisma";
import type { OfferInput, OfferUpdateInput } from "@/lib/schema";

const offerInclude = {
  product: { select: { sku: true, name: true } },
} as const;

export const offerRepository = {
  list() {
    return prisma.offer.findMany({
      include: offerInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  getById(id: string) {
    return prisma.offer.findUnique({ where: { id }, include: offerInclude });
  },

  create(data: OfferInput) {
    return prisma.offer.create({ data, include: offerInclude });
  },

  update(id: string, data: OfferUpdateInput) {
    return prisma.offer.update({
      where: { id },
      data,
      include: offerInclude,
    });
  },

  remove(id: string) {
    return prisma.offer.delete({ where: { id } });
  },
};
