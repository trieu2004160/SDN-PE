import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/books - Get all books
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort') || 'asc'

    let query = supabase
      .from('books')
      .select('*')

    // Filter by search term (title)
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    // Filter by tag
    if (tag) {
      query = query.contains('tags', [tag])
    }

    // Sort by title
    query = query.order('title', { ascending: sort === 'asc' })

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ books: data || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

// POST /api/books - Create a new book
export async function POST(request: NextRequest) {
  try {
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
      .insert([
        {
          title: title.trim(),
          author: author.trim(),
          tags: tags && tags.length > 0 ? tags : null,
          cover_image: cover_image?.trim() || null,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ book: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create book' },
      { status: 500 }
    )
  }
}

