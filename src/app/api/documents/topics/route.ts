import { TOPICS } from '@/lib/mockData';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json(TOPICS);
}