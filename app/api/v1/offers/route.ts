import { NextResponse } from "next/server";

import { offerCreateSchema } from "@/lib/schema";
import { governanceRepository } from "@/repositories/governance.repository";
import { offerRepository } from "@/repositories/offer.repository";
import {
  handleRouteError,
  readJsonBody,
  validationErrorResponse,
} from "../_helpers";

export async function GET() {
  try {
    return NextResponse.json(await offerRepository.list());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = offerCreateSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const offer = await offerRepository.create(parsed.data);

    await governanceRepository.auditWrite(
      "system",
      "offer.created",
      "Offer",
      offer.id,
      { code: offer.code, productId: offer.productId, status: offer.status },
    );

    return NextResponse.json(offer);
  } catch (error) {
    return handleRouteError(error);
  }
}
