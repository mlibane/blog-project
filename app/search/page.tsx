import { Suspense } from 'react'
import SearchResults from '@/components/blog/SearchResults'
import SearchBar from '@/components/blog/SearchBar'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string; category?: string; tag?: string }
}) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      <SearchBar />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  )
}