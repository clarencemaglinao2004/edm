import { NextResponse } from "next/server";
import { z } from "zod";

import { DomainError } from "@/repositories/errors";

export type IdRouteContext = { params: Promise<{ id: string }> };

const uuidSchema = z.uuid();

export function parseId(id: string): string | null {
  const result = uuidSchema.safeParse(id);
  return result.success ? result.data : null;
}

export function invalidIdResponse() {
  return NextResponse.json({ error: "Invalid id" }, { status: 400 });
}

export function validationErrorResponse(error: z.ZodError) {
  return NextResponse.json(
    { error: error.issues.map((issue) => issue.message).join(", ") },
    { status: 400 },
  );
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function handleRouteError(error: unknown) {
  if (error instanceof DomainError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }

  if (error instanceof z.ZodError) {
    return validationErrorResponse(error);
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;

    if (code === "P2025") {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    if (code === "P2002") {
      return NextResponse.json(
        { error: "A record with the same unique value already exists" },
        { status: 400 },
      );
    }
    if (code === "P2003") {
      return NextResponse.json(
        { error: "A related record is missing or is still referenced" },
        { status: 400 },
      );
    }
  }

  console.error("[api/v1]", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 },
  );
}
