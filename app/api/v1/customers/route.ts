import { NextResponse } from "next/server";

import { customerCreateSchema } from "@/lib/schema";
import { customerRepository } from "@/repositories/customer.repository";
import { governanceRepository } from "@/repositories/governance.repository";
import {
  handleRouteError,
  readJsonBody,
  validationErrorResponse,
} from "../_helpers";

export async function GET(request: Request) {
  try {
    const q = new URL(request.url).searchParams.get("q") ?? undefined;
    return NextResponse.json(await customerRepository.list(q));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = customerCreateSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const existing = await customerRepository.getByEmail(parsed.data.email);
    const customer = await customerRepository.upsertByEmail(parsed.data);

    await governanceRepository.auditWrite(
      "system",
      existing ? "customer.updated" : "customer.created",
      "Customer",
      customer.id,
      { email: customer.email },
    );

    return NextResponse.json(customer);
  } catch (error) {
    return handleRouteError(error);
  }
}
