import { NextResponse } from "next/server";

import { posTransactionCreateSchema } from "@/lib/schema";
import { posRepository } from "@/repositories/pos.repository";
import {
  handleRouteError,
  readJsonBody,
  validationErrorResponse,
} from "../../_helpers";

export async function GET() {
  try {
    return NextResponse.json(await posRepository.list());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = posTransactionCreateSchema.safeParse(
      await readJsonBody(request),
    );

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    return NextResponse.json(await posRepository.create(parsed.data));
  } catch (error) {
    return handleRouteError(error);
  }
}
