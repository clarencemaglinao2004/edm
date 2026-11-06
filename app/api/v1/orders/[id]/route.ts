import { NextResponse } from "next/server";

import { orderStatusUpdateSchema } from "@/lib/schema";
import { orderRepository } from "@/repositories/order.repository";
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

    const order = await orderRepository.getById(parsedId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
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

    const parsed = orderStatusUpdateSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    return NextResponse.json(
      await orderRepository.setStatus(parsedId, parsed.data.status),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
