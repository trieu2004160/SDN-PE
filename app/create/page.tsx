'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CreateBook() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [coverImage, setCoverImage] = useState('')
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

    if (!author.trim()) {
      toast.error('Author is required')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/books', {
        method: 'POST',
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
        throw new Error(result.error || 'Failed to create book')
      }

      toast.success('Book created successfully!')
      router.push('/')
    } catch (error: any) {
      toast.error('Error creating book: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>➕ Create New Book</h1>
        <p>Add a new book to your collection</p>
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
            {loading ? '⏳ Creating...' : '✅ Create Book'}
          </button>
        </div>
      </form>
    </div>
  )
}
