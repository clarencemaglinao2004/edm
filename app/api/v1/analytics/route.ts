import { NextResponse } from "next/server";

import { analyticsRepository } from "@/repositories/analytics.repository";
import { handleRouteError } from "../_helpers";

export async function GET() {
  try {
    return NextResponse.json(await analyticsRepository.summary());
  } catch (error) {
    return handleRouteError(error);
  }
}
