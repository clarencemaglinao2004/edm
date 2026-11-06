import { NextResponse } from "next/server";

import { offerUpdateSchema } from "@/lib/schema";
import { governanceRepository } from "@/repositories/governance.repository";
import { offerRepository } from "@/repositories/offer.repository";
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

    const offer = await offerRepository.getById(parsedId);

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json(offer);
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

    const parsed = offerUpdateSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const offer = await offerRepository.update(parsedId, parsed.data);

    await governanceRepository.auditWrite(
      "system",
      "offer.updated",
      "Offer",
      offer.id,
      { fields: Object.keys(parsed.data), status: offer.status },
    );

    return NextResponse.json(offer);
  } catch (error) {
    return handleRouteError(error);
  }
}
