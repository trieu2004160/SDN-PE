'use client'

import { useState, useEffect } from 'react'
import { Book } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    filterAndSortBooks()
  }, [books, searchTerm, selectedTag, sortOrder])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/books')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch books')
      }

      setBooks(result.books || [])
    } catch (error: any) {
      toast.error('Error fetching books: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortBooks = () => {
    let filtered = [...books]

    // Filter by search term (title)
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(book =>
        book.tags && book.tags.includes(selectedTag)
      )
    }

    // Sort by title
    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title)
      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredBooks(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete book')
      }

      toast.success('Book deleted successfully')
      fetchBooks()
      setDeleteConfirm(null)
    } catch (error: any) {
      toast.error('Error deleting book: ' + error.message)
    }
  }

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      books
        .flatMap(book => book.tags || [])
        .filter(tag => tag && tag.trim() !== '')
    )
  ).sort()

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Book Management</h1>
          <p>Loading books...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>📚 Book Management</h1>
        <p>Manage your book collection with ease</p>
      </div>

      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search books by title..."
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
          ➕ Create Book
        </Link>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="no-books">
          <h3>{books.length === 0 ? '📖 No books yet' : '🔍 No books found'}</h3>
          <p>
            {books.length === 0
              ? 'Get started by creating your first book!'
              : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="book-grid">
          {filteredBooks.map(book => (
            <div key={book.id} className="book-card" onClick={() => router.push(`/edit/${book.id}`)}>
              {book.cover_image && (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="book-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
              {!book.cover_image && (
                <div className="book-image">📚 No Cover Image</div>
              )}
              <div className="book-content">
                <h2 className="book-title">{book.title}</h2>
                <p className="book-author">{book.author}</p>
                {book.tags && book.tags.length > 0 && (
                  <div className="book-tags">
                    {book.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="book-actions" onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/edit/${book.id}`}
                    className="btn btn-secondary"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm({ id: book.id, title: book.title })}
                    className="btn btn-danger"
                  >
                    🗑️ Delete
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
            <h3>⚠️ Confirm Delete</h3>
            <p>
              Are you sure you want to delete <strong>&quot;{deleteConfirm.title}&quot;</strong>? 
              <br />
              This action cannot be undone.
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
