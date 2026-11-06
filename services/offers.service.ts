import axiosInstance from "@/lib/axios";
import type { Offer, OfferInput, OfferUpdateInput } from "@/lib/schema";

export const offersService = {
  list: async (): Promise<Offer[]> => {
    const response = await axiosInstance.get<Offer[]>("/api/v1/offers");
    return response.data;
  },

  create: async (data: OfferInput): Promise<Offer> => {
    const response = await axiosInstance.post<Offer>("/api/v1/offers", data);
    return response.data;
  },

  update: async (id: string, data: OfferUpdateInput): Promise<Offer> => {
    const response = await axiosInstance.patch<Offer>(
      `/api/v1/offers/${id}`,
      data,
    );
    return response.data;
  },
};
