import { NextRequest, NextResponse } from 'next/server'

// This route is deprecated - redirect to books API
export async function GET() {
  return NextResponse.json(
    { error: 'This endpoint has been moved to /api/books/[id]' },
    { status: 410 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'This endpoint has been moved to /api/books/[id]' },
    { status: 410 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'This endpoint has been moved to /api/books/[id]' },
    { status: 410 }
  )
}

