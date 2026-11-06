import { prisma } from "@/lib/prisma";
import type { ProductInput, ProductUpdateInput } from "@/lib/schema";

export const productRepository = {
  list(params?: { q?: string; category?: string }) {
    const where = {
      ...(params?.q
        ? {
            OR: [
              { sku: { contains: params.q, mode: "insensitive" as const } },
              { name: { contains: params.q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(params?.category ? { category: params.category } : {}),
    };

    return prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  getById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  },

  findBySku(sku: string) {
    return prisma.product.findUnique({ where: { sku } });
  },

  findByIds(ids: string[]) {
    return prisma.product.findMany({ where: { id: { in: ids } } });
  },

  create(data: ProductInput) {
    return prisma.product.create({ data });
  },

  update(id: string, data: ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.product.delete({ where: { id } });
  },
};
