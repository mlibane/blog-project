// components/blog/SearchResults.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchResults({
  initialPosts,
  initialTotal,
  initialPage,
  initialTotalPages,
  searchParams,
}: {
  initialPosts: any[]
  initialTotal: number
  initialPage: number
  initialTotalPages: number
  searchParams: { q?: string; category?: string; tag?: string; page?: string }
}) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [query, setQuery] = useState(searchParams.q || '')
  const [category, setCategory] = useState(searchParams.category || 'all')
  const [tag, setTag] = useState(searchParams.tag || '')
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))

    if (query || category || tag) {
      fetchResults()
    }
  }, [])

  const fetchResults = async () => {
    setIsLoading(true)
    const params = new URLSearchParams({
      q: query,
      category: category === 'all' ? '' : category, 
      tag,
      page: page.toString(),
    })
    try {
      const res = await fetch(`/api/search?${params}`)
      if (!res.ok) throw new Error('Failed to fetch search results')
      const data = await res.json()
      setPosts(data.posts)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching search results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchResults()
    updateUrl()
  }

  const updateUrl = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('category', category)
    if (tag) params.set('tag', tag)
    params.set('page', page.toString())
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-2">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Filter by tag"
        />
        <Button type="submit">Search</Button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <div key={post.id} className="border p-4 rounded-md">
              <Link href={`/posts/${post.slug}`} className="text-xl font-semibold hover:underline">
                {post.title}
              </Link>
              <p className="text-gray-500 mt-2">By {post.author.name}</p>
              <p className="mt-2">{post.content.substring(0, 150)}...</p>
              {post.category && (
                <p className="mt-2 text-sm">
                  Category: <span className="font-semibold">{post.category.name}</span>
                </p>
              )}
              {post.tags.length > 0 && (
                <p className="mt-2 text-sm">
                  Tags: {post.tags.map((tag: any) => tag.name).join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => {
              const newPage = Math.max(1, page - 1)
              setPage(newPage)
              fetchResults()
            }}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span>Page {page} of {totalPages}</span>
          <Button
            onClick={() => {
              const newPage = Math.min(totalPages, page + 1)
              setPage(newPage)
              fetchResults()
            }}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}