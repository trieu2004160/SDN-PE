'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CreateRecipe() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!ingredients.trim()) {
      toast.error('Ingredients is required')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          ingredients: ingredients.trim(),
          tags: tags.length > 0 ? tags : null,
          image_url: imageUrl.trim() || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create recipe')
      }

      toast.success('Recipe created successfully!')
      router.push('/')
    } catch (error: any) {
      toast.error('Error creating recipe: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Create New Recipe</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="title">
            Title <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter recipe title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">
            Ingredients <span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (one per line or comma-separated)"
            required
          />
          <small>You can list ingredients one per line or separated by commas</small>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (Optional)</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder="Enter tag and press Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              Add Tag
            </button>
          </div>
          {tags.length > 0 && (
            <div className="tags-input">
              {tags.map((tag, index) => (
                <div key={index} className="tag-input-item">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <small>Examples: Vegan, Dessert, Quick, Breakfast, etc.</small>
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (Optional)</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <small>Enter a URL to an image for this recipe</small>
          {imageUrl && (
            <div className="image-preview">
              <img src={imageUrl} alt="Preview" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }} />
            </div>
          )}
        </div>

        <div className="form-actions">
          <Link href="/" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  )
}

