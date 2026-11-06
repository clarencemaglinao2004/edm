import { NextResponse } from "next/server";

import { productCreateSchema } from "@/lib/schema";
import { governanceRepository } from "@/repositories/governance.repository";
import { productRepository } from "@/repositories/product.repository";
import {
  handleRouteError,
  readJsonBody,
  validationErrorResponse,
} from "../_helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const category = searchParams.get("category") ?? undefined;

    return NextResponse.json(await productRepository.list({ q, category }));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = productCreateSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const product = await productRepository.create(parsed.data);

    await governanceRepository.auditWrite(
      "system",
      "product.created",
      "Product",
      product.id,
      { sku: product.sku, name: product.name, price: product.price.toString() },
    );

    return NextResponse.json(product);
  } catch (error) {
    return handleRouteError(error);
  }
}
