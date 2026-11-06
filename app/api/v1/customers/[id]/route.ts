import { NextResponse } from "next/server";

import { customerUpdateSchema } from "@/lib/schema";
import { customerRepository } from "@/repositories/customer.repository";
import { governanceRepository } from "@/repositories/governance.repository";
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

    const customer = await customerRepository.getById(parsedId);

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
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

    const parsed = customerUpdateSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const customer = await customerRepository.update(parsedId, parsed.data);

    await governanceRepository.auditWrite(
      "system",
      "customer.updated",
      "Customer",
      customer.id,
      { fields: Object.keys(parsed.data) },
    );

    return NextResponse.json(customer);
  } catch (error) {
    return handleRouteError(error);
  }
}
