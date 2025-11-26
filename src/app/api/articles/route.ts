import { NextResponse } from 'next/server';
import { ARTICLES_DATA } from '@/lib/mockData';

export async function GET() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json(ARTICLES_DATA);
}