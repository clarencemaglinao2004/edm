import { NextResponse } from "next/server";

import { orderCreateSchema } from "@/lib/schema";
import { orderRepository } from "@/repositories/order.repository";
import {
  handleRouteError,
  readJsonBody,
  validationErrorResponse,
} from "../_helpers";

export async function GET() {
  try {
    return NextResponse.json(await orderRepository.list());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = orderCreateSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    return NextResponse.json(await orderRepository.create(parsed.data));
  } catch (error) {
    return handleRouteError(error);
  }
}
