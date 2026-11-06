import axiosInstance from "@/lib/axios";
import type { PosTransaction, PosTransactionInput } from "@/lib/schema";

export const posService = {
  list: async (): Promise<PosTransaction[]> => {
    const response = await axiosInstance.get<PosTransaction[]>(
      "/api/v1/pos/transactions",
    );
    return response.data;
  },

  create: async (data: PosTransactionInput): Promise<PosTransaction> => {
    const response = await axiosInstance.post<PosTransaction>(
      "/api/v1/pos/transactions",
      data,
    );
    return response.data;
  },
};
