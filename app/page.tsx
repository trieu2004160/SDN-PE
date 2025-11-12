'use client'

import { useState, useEffect } from 'react'
import { Recipe } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { signOut } from '@/lib/auth'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchRecipes()
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const result = await signOut()
      if (result.success) {
        toast.success('Đăng xuất thành công!')
        setUser(null)
        router.refresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast.error('Lỗi đăng xuất: ' + error.message)
    }
  }

  useEffect(() => {
    filterAndSortRecipes()
  }, [recipes, searchTerm, selectedTag, sortOrder])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/recipes')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch recipes')
      }

      setRecipes(result.recipes || [])
    } catch (error: any) {
      toast.error('Error fetching recipes: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortRecipes = () => {
    let filtered = [...recipes]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(recipe =>
        recipe.tags && recipe.tags.includes(selectedTag)
      )
    }

    // Sort by title
    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title)
      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredRecipes(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete recipe')
      }

      toast.success('Recipe deleted successfully')
      fetchRecipes()
      setDeleteConfirm(null)
    } catch (error: any) {
      toast.error('Error deleting recipe: ' + error.message)
    }
  }

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      recipes
        .flatMap(recipe => recipe.tags || [])
        .filter(tag => tag && tag.trim() !== '')
    )
  ).sort()

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Recipe Sharing App</h1>
          <p>Loading recipes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div>
            <h1>Recipe Sharing App</h1>
            <p>Discover and manage your favorite recipes</p>
          </div>
          <div className="auth-section">
            {user ? (
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-secondary">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search recipes by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        <div className="sort-box">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
        </div>
        <Link href="/create" className="btn btn-primary">
          + Create Recipe
        </Link>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="no-recipes">
          <h3>No recipes found</h3>
          <p>
            {recipes.length === 0
              ? 'Get started by creating your first recipe!'
              : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              {recipe.image_url && (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="recipe-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
              {!recipe.image_url && (
                <div className="recipe-image">No Image</div>
              )}
              <div className="recipe-content">
                <h2 className="recipe-title">{recipe.title}</h2>
                <p className="recipe-ingredients">
                  {recipe.ingredients.split('\n').slice(0, 3).join(', ')}
                  {recipe.ingredients.split('\n').length > 3 && '...'}
                </p>
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="recipe-tags">
                    {recipe.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="recipe-actions">
                  <Link
                    href={`/edit/${recipe.id}`}
                    className="btn btn-secondary"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm({ id:recipe.id, title: recipe.title })}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="confirm-dialog" onClick={() => setDeleteConfirm(null)}>
          <div
            className="confirm-dialog-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete &quot;{deleteConfirm.title}&quot;? This action cannot be undone.
            </p>
            <div className="confirm-dialog-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirm.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

