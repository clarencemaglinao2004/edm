import { NextResponse } from "next/server";

import { shipmentUpdateSchema } from "@/lib/schema";
import { governanceRepository } from "@/repositories/governance.repository";
import { shipmentRepository } from "@/repositories/shipment.repository";
import {
  handleRouteError,
  invalidIdResponse,
  parseId,
  readJsonBody,
  validationErrorResponse,
  type IdRouteContext,
} from "../../_helpers";

export async function GET(_request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    const parsedId = parseId(id);

    if (!parsedId) {
      return invalidIdResponse();
    }

    const shipment = await shipmentRepository.getById(parsedId);

    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    return NextResponse.json(shipment);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    const parsedId = parseId(id);

    if (!parsedId) {
      return invalidIdResponse();
    }

    const parsed = shipmentUpdateSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const shipment = await shipmentRepository.update(parsedId, parsed.data);

    await governanceRepository.auditWrite(
      "system",
      "shipment.status_changed",
      "Shipment",
      shipment.id,
      {
        status: shipment.status,
        trackingNumber: shipment.trackingNumber,
      },
    );

    return NextResponse.json(shipment);
  } catch (error) {
    return handleRouteError(error);
  }
}
