import { NextResponse } from "next/server";

import { governanceRepository } from "@/repositories/governance.repository";
import { handleRouteError } from "../_helpers";

export async function GET(request: Request) {
  try {
    const source = new URL(request.url).searchParams.get("source") ?? undefined;
    return NextResponse.json(await governanceRepository.listEvents(source));
  } catch (error) {
    return handleRouteError(error);
  }
}
