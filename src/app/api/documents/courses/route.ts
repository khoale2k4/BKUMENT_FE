import { COURSES_DATA } from '@/lib/mockData';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter courses by search query
    const filteredCourses = COURSES_DATA.filter(
        (course) =>
            course.name.toLowerCase().includes(query.toLowerCase()) ||
            course.id.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({
        code: 1000,
        message: "Get subjects successfully",
        result: filteredCourses
    });
}
