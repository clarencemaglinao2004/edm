import { prisma } from "@/lib/prisma";

function formatMoney(value: { toString(): string } | null | undefined) {
  if (!value) return "0.00";
  return Number(value.toString()).toFixed(2);
}

export const analyticsRepository = {
  async summary() {
    const [
      products,
      customers,
      posTransactions,
      storefrontOrders,
      posRevenueAgg,
      storefrontRevenueAgg,
      lowStock,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.posTransaction.count(),
      prisma.storefrontOrder.count(),
      prisma.posTransaction.aggregate({ _sum: { total: true } }),
      prisma.storefrontOrder.aggregate({ _sum: { total: true } }),
      prisma.inventoryItem.count({ where: { quantity: { lte: 5 } } }),
    ]);

    return {
      products,
      customers,
      posTransactions,
      storefrontOrders,
      posRevenue: formatMoney(posRevenueAgg._sum.total),
      storefrontRevenue: formatMoney(storefrontRevenueAgg._sum.total),
      lowStock,
    };
  },
};
