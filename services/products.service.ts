import axiosInstance from "@/lib/axios";
import type { Product, ProductInput, ProductUpdateInput } from "@/lib/schema";

export const productsService = {
  list: async (params?: { q?: string; category?: string }): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>("/api/v1/products", {
      params,
    });
    return response.data;
  },

  get: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/api/v1/products/${id}`);
    return response.data;
  },

  create: async (data: ProductInput): Promise<Product> => {
    const response = await axiosInstance.post<Product>("/api/v1/products", data);
    return response.data;
  },

  update: async (id: string, data: ProductUpdateInput): Promise<Product> => {
    const response = await axiosInstance.patch<Product>(
      `/api/v1/products/${id}`,
      data,
    );
    return response.data;
  },

  remove: async (id: string): Promise<{ id: string; deleted: boolean }> => {
    const response = await axiosInstance.delete<{ id: string; deleted: boolean }>(
      `/api/v1/products/${id}`,
    );
    return response.data;
  },
};
