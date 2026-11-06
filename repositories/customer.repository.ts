import { prisma } from "@/lib/prisma";
import type { CustomerInput, CustomerUpdateInput } from "@/lib/schema";

export const customerRepository = {
  list(q?: string) {
    return prisma.customer.findMany({
      where: q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });
  },

  getById(id: string) {
    return prisma.customer.findUnique({ where: { id } });
  },

  getByEmail(email: string) {
    return prisma.customer.findUnique({ where: { email } });
  },

  create(data: CustomerInput) {
    return prisma.customer.create({ data });
  },

  upsertByEmail(data: CustomerInput) {
    const { email, ...rest } = data;

    return prisma.customer.upsert({
      where: { email },
      update: rest,
      create: { email, ...rest },
    });
  },

  update(id: string, data: CustomerUpdateInput) {
    return prisma.customer.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.customer.delete({ where: { id } });
  },
};
