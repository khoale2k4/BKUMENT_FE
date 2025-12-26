import { BLOD_DATA } from '@/lib/mockData';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    const { id } = await context.params;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json(BLOD_DATA);
}