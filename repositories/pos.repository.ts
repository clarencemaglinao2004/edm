import { prisma } from "@/lib/prisma";
import type { PosTransactionInput } from "@/lib/schema";
import { DomainError } from "./errors";
import { inventoryRepository } from "./inventory.repository";

export const posRepository = {
  list() {
    return prisma.posTransaction.findMany({
      include: {
        items: {
          include: { product: { select: { sku: true, name: true } } },
        },
      },
      orderBy: { occurredAt: "desc" },
    });
  },

  create(input: PosTransactionInput) {
    return prisma.$transaction(async (tx) => {
      const uniqueProductIds = [...new Set(input.items.map((item) => item.productId))];
      const products = await tx.product.findMany({
        where: { id: { in: uniqueProductIds } },
      });

      if (products.length !== uniqueProductIds.length) {
        throw new DomainError("One or more products were not found", 400);
      }

      const priceById = new Map(products.map((product) => [product.id, product.price]));
      const lines = input.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: priceById.get(item.productId)!,
      }));

      const total = lines.reduce(
        (sum, line) => sum + Number(line.unitPrice.toString()) * line.quantity,
        0,
      );

      const email = input.email ?? null;
      const customer = email
        ? await tx.customer.findUnique({ where: { email } })
        : null;

      const transaction = await tx.posTransaction.create({
        data: {
          customerId: customer?.id ?? null,
          email,
          total: total.toFixed(2),
          items: {
            create: lines.map((line) => ({
              productId: line.productId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
            })),
          },
        },
        include: {
          items: {
            include: { product: { select: { sku: true, name: true } } },
          },
        },
      });

      await inventoryRepository.decrement(tx, "POS", lines);

      await tx.integrationEvent.create({
        data: {
          source: "POS",
          topic: "transaction.created",
          payload: {
            transactionId: transaction.id,
            ...(email ? { email } : {}),
            customerId: customer?.id ?? null,
            total: transaction.total.toString(),
            itemCount: lines.length,
          },
          status: "PROCESSED",
          processedAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          actor: "system",
          action: "pos.transaction.created",
          entity: "PosTransaction",
          entityId: transaction.id,
          detail: {
            total: transaction.total.toString(),
            itemCount: lines.length,
            email,
          },
        },
      });

      return transaction;
    });
  },
};
