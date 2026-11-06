import axiosInstance from "@/lib/axios";
import type { Shipment, ShipmentInput, ShipmentUpdateInput } from "@/lib/schema";

export const shipmentsService = {
  list: async (): Promise<Shipment[]> => {
    const response = await axiosInstance.get<Shipment[]>("/api/v1/shipments");
    return response.data;
  },

  create: async (data: ShipmentInput): Promise<Shipment> => {
    const response = await axiosInstance.post<Shipment>(
      "/api/v1/shipments",
      data,
    );
    return response.data;
  },

  update: async (id: string, data: ShipmentUpdateInput): Promise<Shipment> => {
    const response = await axiosInstance.patch<Shipment>(
      `/api/v1/shipments/${id}`,
      data,
    );
    return response.data;
  },
};
