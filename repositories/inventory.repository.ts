import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { Channel, InventoryAdjustInput, InventoryInput } from "@/lib/schema";

const productSelect = { select: { sku: true, name: true } } as const;

type InventoryLine = { productId: string; quantity: number };

export const inventoryRepository = {
  list(channel?: Channel) {
    return prisma.inventoryItem.findMany({
      where: channel ? { channel } : undefined,
      include: { product: productSelect },
      orderBy: [{ channel: "asc" }, { updatedAt: "desc" }],
    });
  },

  upsert(data: InventoryInput) {
    return prisma.inventoryItem.upsert({
      where: {
        productId_channel: { productId: data.productId, channel: data.channel },
      },
      update: {
        quantity: data.quantity,
        location: data.location,
      },
      create: {
        productId: data.productId,
        channel: data.channel,
        quantity: data.quantity,
        location: data.location,
      },
      include: { product: productSelect },
    });
  },

  async adjust(data: InventoryAdjustInput) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.inventoryItem.findUnique({
        where: {
          productId_channel: { productId: data.productId, channel: data.channel },
        },
      });

      if (existing) {
        return tx.inventoryItem.update({
          where: { id: existing.id },
          data: { quantity: Math.max(0, existing.quantity + data.delta) },
          include: { product: productSelect },
        });
      }

      return tx.inventoryItem.create({
        data: {
          productId: data.productId,
          channel: data.channel,
          quantity: Math.max(0, data.delta),
        },
        include: { product: productSelect },
      });
    });
  },

  async decrement(
    tx: Prisma.TransactionClient,
    channel: Channel,
    lines: InventoryLine[],
  ) {
    for (const line of lines) {
      const existing = await tx.inventoryItem.findFirst({
        where: { productId: line.productId, channel },
      });

      if (existing) {
        await tx.inventoryItem.update({
          where: { id: existing.id },
          data: {
            quantity: Math.max(0, existing.quantity - line.quantity),
          },
        });
      }
    }
  },
};
