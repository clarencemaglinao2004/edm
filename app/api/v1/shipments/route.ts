import { NextResponse } from "next/server";

import { shipmentCreateSchema } from "@/lib/schema";
import { governanceRepository } from "@/repositories/governance.repository";
import { shipmentRepository } from "@/repositories/shipment.repository";
import {
  handleRouteError,
  readJsonBody,
  validationErrorResponse,
} from "../_helpers";

export async function GET() {
  try {
    return NextResponse.json(await shipmentRepository.list());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = shipmentCreateSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const shipment = await shipmentRepository.create(parsed.data);

    await governanceRepository.auditWrite(
      "system",
      "shipment.created",
      "Shipment",
      shipment.id,
      {
        orderId: shipment.orderId,
        carrier: shipment.carrier,
        status: shipment.status,
      },
    );

    return NextResponse.json(shipment);
  } catch (error) {
    return handleRouteError(error);
  }
}
