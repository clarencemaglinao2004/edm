import axiosInstance from "@/lib/axios";

export interface AnalyticsSummary {
  products: number;
  customers: number;
  posTransactions: number;
  storefrontOrders: number;
  posRevenue: string;
  storefrontRevenue: string;
  lowStock: number;
}

export const analyticsService = {
  summary: async (): Promise<AnalyticsSummary> => {
    const response = await axiosInstance.get<AnalyticsSummary>("/api/v1/analytics");
    return response.data;
  },
};
