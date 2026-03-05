import { UNIVERSITIES_DATA } from '@/lib/mockData';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter universities by search query
    const filteredUniversities = UNIVERSITIES_DATA.filter(
        (university) =>
            university.name.toLowerCase().includes(query.toLowerCase()) ||
            university.abbreviation.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({
        code: 1000,
        message: "Get universities successfully",
        result: filteredUniversities
    });
}
