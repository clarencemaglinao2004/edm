import axiosInstance from "@/lib/axios";
import type { OrderInput, OrderStatus, StorefrontOrder } from "@/lib/schema";

export const ordersService = {
  list: async (): Promise<StorefrontOrder[]> => {
    const response = await axiosInstance.get<StorefrontOrder[]>("/api/v1/orders");
    return response.data;
  },

  create: async (data: OrderInput): Promise<StorefrontOrder> => {
    const response = await axiosInstance.post<StorefrontOrder>(
      "/api/v1/orders",
      data,
    );
    return response.data;
  },

  setStatus: async (id: string, status: OrderStatus): Promise<StorefrontOrder> => {
    const response = await axiosInstance.patch<StorefrontOrder>(
      `/api/v1/orders/${id}`,
      { status },
    );
    return response.data;
  },
};
