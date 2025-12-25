import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json({
    user: "Robert Fox",
    avatar: "https://placehold.co/400x400/6366f1/FFF?text=Setup",
  });
}
