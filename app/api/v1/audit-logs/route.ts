import { NextResponse } from "next/server";

import { governanceRepository } from "@/repositories/governance.repository";
import { handleRouteError } from "../_helpers";

export async function GET() {
  try {
    return NextResponse.json(await governanceRepository.listAudit());
  } catch (error) {
    return handleRouteError(error);
  }
}
