import { prisma } from "@/lib/prisma";
import type { ShipmentInput, ShipmentUpdateInput } from "@/lib/schema";

const shipmentInclude = {
  order: { include: { customer: true } },
} as const;

export const shipmentRepository = {
  list() {
    return prisma.shipment.findMany({
      include: shipmentInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  getById(id: string) {
    return prisma.shipment.findUnique({
      where: { id },
      include: shipmentInclude,
    });
  },

  create(data: ShipmentInput) {
    return prisma.shipment.create({
      data: { orderId: data.orderId, carrier: data.carrier, status: "PENDING" },
      include: shipmentInclude,
    });
  },

  update(id: string, data: ShipmentUpdateInput) {
    const now = new Date();

    return prisma.shipment.update({
      where: { id },
      data: {
        status: data.status,
        trackingNumber: data.trackingNumber,
        ...(data.status === "IN_TRANSIT" ? { shippedAt: now } : {}),
        ...(data.status === "DELIVERED" ? { deliveredAt: now } : {}),
      },
      include: shipmentInclude,
    });
  },
};
