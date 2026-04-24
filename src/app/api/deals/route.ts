import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("GET /api/deals error:", error);

    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const deal = await prisma.deal.create({
      data: {
        material: body.material,
        quantity: body.quantity,
        targetPrice: body.targetPrice,
        deliveryDate: body.deliveryDate,
        status: body.status ?? "NEGOTIATING",
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("POST /api/deals error:", error);

    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}