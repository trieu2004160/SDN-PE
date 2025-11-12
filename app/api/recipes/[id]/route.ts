import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/recipes/[id] - Get a single recipe by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[DEBUG] GET /api/recipes/[id] - Starting request');
    const { id } = await params;
    console.log('[DEBUG] Recipe ID:', id);

    console.log('[DEBUG] Attempting to fetch recipe from Supabase...');
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()
    
    console.log('[DEBUG] Supabase response:', { data, error });

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ recipe: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recipe' },
      { status: 500 }
    )
  }
}

// PUT /api/recipes/[id] - Update a recipe
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[DEBUG] PUT /api/recipes/[id] - Starting request');
    const { id } = await params;
    console.log('[DEBUG] Recipe ID to update:', id);
    
    const body = await request.json();
    console.log('[DEBUG] Request body:', body);
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
      .update({
        title: title.trim(),
        ingredients: ingredients.trim(),
        tags: tags && tags.length > 0 ? tags : null,
        image_url: image_url?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ recipe: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update recipe' },
      { status: 500 }
    )
  }
}

// DELETE /api/recipes/[id] - Delete a recipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[DEBUG] DELETE /api/recipes/[id] - Starting request');
    const { id } = await params;
    console.log('[DEBUG] Recipe ID to delete:', id);

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Recipe deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete recipe' },
      { status: 500 }
    )
  }
}

