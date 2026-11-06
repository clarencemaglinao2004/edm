import { prisma } from "@/lib/prisma";
import type { OrderInput, OrderStatus } from "@/lib/schema";
import { DomainError } from "./errors";
import { inventoryRepository } from "./inventory.repository";

const orderInclude = {
  items: {
    include: { product: { select: { sku: true, name: true } } },
  },
  customer: true,
  shipments: true,
} as const;

export const orderRepository = {
  list() {
    return prisma.storefrontOrder.findMany({
      include: orderInclude,
      orderBy: { placedAt: "desc" },
    });
  },

  getById(id: string) {
    return prisma.storefrontOrder.findUnique({
      where: { id },
      include: orderInclude,
    });
  },

  create(input: OrderInput) {
    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: input.customerId },
      });

      if (!customer) {
        throw new DomainError("Customer not found", 400);
      }

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

      const order = await tx.storefrontOrder.create({
        data: {
          customerId: input.customerId,
          total: total.toFixed(2),
          items: {
            create: lines.map((line) => ({
              productId: line.productId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
            })),
          },
        },
        include: orderInclude,
      });

      await inventoryRepository.decrement(tx, "STOREFRONT", lines);

      await tx.integrationEvent.create({
        data: {
          source: "STOREFRONT",
          topic: "order.created",
          payload: {
            orderId: order.id,
            customerId: order.customerId,
            total: order.total.toString(),
            itemCount: lines.length,
          },
          status: "PROCESSED",
          processedAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          actor: "system",
          action: "order.created",
          entity: "StorefrontOrder",
          entityId: order.id,
          detail: {
            customerId: order.customerId,
            total: order.total.toString(),
            itemCount: lines.length,
          },
        },
      });

      return order;
    });
  },

  setStatus(id: string, status: OrderStatus) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.storefrontOrder.update({
        where: { id },
        data: { status },
        include: orderInclude,
      });

      await tx.auditLog.create({
        data: {
          actor: "system",
          action: "order.status_changed",
          entity: "StorefrontOrder",
          entityId: order.id,
          detail: { status },
        },
      });

      return order;
    });
  },
};
