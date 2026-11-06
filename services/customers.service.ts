import axiosInstance from "@/lib/axios";
import type {
  Customer,
  CustomerInput,
  CustomerUpdateInput,
} from "@/lib/schema";

export const customersService = {
  list: async (q?: string): Promise<Customer[]> => {
    const response = await axiosInstance.get<Customer[]>("/api/v1/customers", {
      params: q ? { q } : undefined,
    });
    return response.data;
  },

  get: async (id: string): Promise<Customer> => {
    const response = await axiosInstance.get<Customer>(`/api/v1/customers/${id}`);
    return response.data;
  },

  create: async (data: CustomerInput): Promise<Customer> => {
    const response = await axiosInstance.post<Customer>("/api/v1/customers", data);
    return response.data;
  },

  update: async (id: string, data: CustomerUpdateInput): Promise<Customer> => {
    const response = await axiosInstance.patch<Customer>(
      `/api/v1/customers/${id}`,
      data,
    );
    return response.data;
  },
};
