import axiosInstance from "@/lib/axios";

export interface IntegrationEvent {
  id: string;
  source: string;
  topic: string;
  payload: unknown;
  status: "PENDING" | "PROCESSED" | "FAILED";
  occurredAt: string;
  processedAt: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string | null;
  detail: unknown;
  at: string;
}

export const governanceService = {
  listEvents: async (source?: string): Promise<IntegrationEvent[]> => {
    const response = await axiosInstance.get<IntegrationEvent[]>(
      "/api/v1/integration-events",
      { params: source ? { source } : undefined },
    );
    return response.data;
  },

  listAudit: async (): Promise<AuditLog[]> => {
    const response = await axiosInstance.get<AuditLog[]>("/api/v1/audit-logs");
    return response.data;
  },
};
