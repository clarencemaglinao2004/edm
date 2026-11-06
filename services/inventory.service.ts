import axiosInstance from "@/lib/axios";
import type {
  Channel,
  InventoryAdjustInput,
  InventoryInput,
  InventoryItem,
} from "@/lib/schema";

export const inventoryService = {
  list: async (channel?: Channel): Promise<InventoryItem[]> => {
    const response = await axiosInstance.get<InventoryItem[]>("/api/v1/inventory", {
      params: channel ? { channel } : undefined,
    });
    return response.data;
  },

  upsert: async (data: InventoryInput): Promise<InventoryItem> => {
    const response = await axiosInstance.post<InventoryItem>(
      "/api/v1/inventory",
      data,
    );
    return response.data;
  },

  adjust: async (data: InventoryAdjustInput): Promise<InventoryItem> => {
    const response = await axiosInstance.patch<InventoryItem>(
      "/api/v1/inventory",
      data,
    );
    return response.data;
  },
};
