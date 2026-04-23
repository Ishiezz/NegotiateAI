import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
    });
    if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    return NextResponse.json(deal);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(deal);
  } catch {
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.deal.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Deal deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 });
  }
}
