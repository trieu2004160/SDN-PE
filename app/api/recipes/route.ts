import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/recipes - Get all recipes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort') || 'desc'

    let query = supabase
      .from('recipes')
      .select('*')

    // Filter by search term (title)
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    // Filter by tag
    if (tag) {
      query = query.contains('tags', [tag])
    }

    // Sort by created_at
    query = query.order('created_at', { ascending: sort === 'asc' })

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ recipes: data || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, ingredients, tags, image_url } = body

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!ingredients || !ingredients.trim()) {
      return NextResponse.json(
        { error: 'Ingredients is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('recipes')
      .insert([
        {
          title: title.trim(),
          ingredients: ingredients.trim(),
          tags: tags && tags.length > 0 ? tags : null,
          image_url: image_url?.trim() || null,
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

    return NextResponse.json({ recipe: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create recipe' },
      { status: 500 }
    )
  }
}

