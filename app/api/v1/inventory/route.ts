import { NextResponse } from "next/server";

import {
  channelSchema,
  inventoryAdjustSchema,
  inventoryUpsertSchema,
} from "@/lib/schema";
import { governanceRepository } from "@/repositories/governance.repository";
import { inventoryRepository } from "@/repositories/inventory.repository";
import {
  handleRouteError,
  readJsonBody,
  validationErrorResponse,
} from "../_helpers";

export async function GET(request: Request) {
  try {
    const channelParam = new URL(request.url).searchParams.get("channel");

    if (!channelParam) {
      return NextResponse.json(await inventoryRepository.list());
    }

    const parsedChannel = channelSchema.safeParse(channelParam);

    if (!parsedChannel.success) {
      return NextResponse.json(
        { error: "Invalid channel" },
        { status: 400 },
      );
    }

    return NextResponse.json(await inventoryRepository.list(parsedChannel.data));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = inventoryUpsertSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const item = await inventoryRepository.upsert(parsed.data);

    await governanceRepository.auditWrite(
      "system",
      "inventory.upserted",
      "InventoryItem",
      item.id,
      {
        productId: item.productId,
        channel: item.channel,
        quantity: item.quantity,
      },
    );

    return NextResponse.json(item);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const parsed = inventoryAdjustSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const item = await inventoryRepository.adjust(parsed.data);

    await governanceRepository.auditWrite(
      "system",
      "inventory.adjusted",
      "InventoryItem",
      item.id,
      {
        productId: item.productId,
        channel: item.channel,
        delta: parsed.data.delta,
        quantity: item.quantity,
      },
    );

    return NextResponse.json(item);
  } catch (error) {
    return handleRouteError(error);
  }
}
