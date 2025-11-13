import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/books/[id] - Get a single book by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Book not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ book: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch book' },
      { status: 500 }
    )
  }
}

// PUT /api/books/[id] - Update a book
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, author, tags, cover_image } = body

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!author || !author.trim()) {
      return NextResponse.json(
        { error: 'Author is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('books')
      .update({
        title: title.trim(),
        author: author.trim(),
        tags: tags && tags.length > 0 ? tags : null,
        cover_image: cover_image?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Book not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ book: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update book' },
      { status: 500 }
    )
  }
}

// DELETE /api/books/[id] - Delete a book
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete book' },
      { status: 500 }
    )
  }
}

