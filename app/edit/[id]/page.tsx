'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Book } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function EditBook() {
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchBook()
  }, [bookId])

  const fetchBook = async () => {
    try {
      setFetching(true)
      const response = await fetch(`/api/books/${bookId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch book')
      }

      if (result.book) {
        setTitle(result.book.title)
        setAuthor(result.book.author)
        setTags(result.book.tags || [])
        setCoverImage(result.book.cover_image || '')
      }
    } catch (error: any) {
      toast.error('Error fetching book: ' + error.message)
      router.push('/')
    } finally {
      setFetching(false)
    }
  }

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

    if (!author.trim()) {
      toast.error('Author is required')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          tags: tags.length > 0 ? tags : null,
          cover_image: coverImage.trim() || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update book')
      }

      toast.success('Book updated successfully!')
      router.push('/')
    } catch (error: any) {
      toast.error('Error updating book: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="container">
        <div className="header">
          <h1>✏️ Edit Book</h1>
          <p>⏳ Loading book...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>✏️ Edit Book</h1>
        <p>Update book information</p>
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
            placeholder="Enter book title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">
            Author <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            required
          />
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
          <small>Examples: IT, Programming, Fiction, etc.</small>
        </div>

        <div className="form-group">
          <label htmlFor="coverImage">Cover Image (Optional)</label>
          <input
            type="url"
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/cover.jpg"
          />
          <small>Enter a URL to a cover image for this book</small>
          {coverImage && (
            <div className="image-preview">
              <img src={coverImage} alt="Preview" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }} />
            </div>
          )}
        </div>

        <div className="form-actions">
          <Link href="/" className="btn btn-secondary">
            ← Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
