import { db } from "@/lib/db";
import { ProductFilterValidator } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { filter } = await req.json();
  const { color, price, size, sort } = ProductFilterValidator.parse(filter);

  const products = await db.query({
    topK: 12,
    vector: [0, 0, 0],
    includeMetadata: true,
  });

  return NextResponse.json({
    products,
    success: true,
  });
};
