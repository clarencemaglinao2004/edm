import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export const governanceRepository = {
  listEvents(source?: string) {
    return prisma.integrationEvent.findMany({
      where: source ? { source } : undefined,
      orderBy: { occurredAt: "desc" },
      take: 50,
    });
  },

  listAudit() {
    return prisma.auditLog.findMany({
      orderBy: { at: "desc" },
      take: 50,
    });
  },

  auditWrite(
    actor: string,
    action: string,
    entity: string,
    entityId?: string | null,
    detail?: Prisma.InputJsonValue,
  ) {
    return prisma.auditLog.create({
      data: {
        actor,
        action,
        entity,
        entityId: entityId ?? null,
        detail,
      },
    });
  },
};
