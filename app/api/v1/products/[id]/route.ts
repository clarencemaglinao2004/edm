import { NextResponse } from "next/server";

import { productUpdateSchema } from "@/lib/schema";
import { governanceRepository } from "@/repositories/governance.repository";
import { productRepository } from "@/repositories/product.repository";
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

    const product = await productRepository.getById(parsedId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
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

    const parsed = productUpdateSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const product = await productRepository.update(parsedId, parsed.data);

    await governanceRepository.auditWrite(
      "system",
      "product.updated",
      "Product",
      product.id,
      { fields: Object.keys(parsed.data) },
    );

    return NextResponse.json(product);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    const parsedId = parseId(id);

    if (!parsedId) {
      return invalidIdResponse();
    }

    const product = await productRepository.remove(parsedId);

    await governanceRepository.auditWrite(
      "system",
      "product.deleted",
      "Product",
      product.id,
      { sku: product.sku },
    );

    return NextResponse.json({ id: product.id, deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
