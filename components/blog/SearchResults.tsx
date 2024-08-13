import Link from 'next/link'

async function searchPosts(searchParams: { q?: string; category?: string; tag?: string }) {
  const params = new URLSearchParams(searchParams as Record<string, string>)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?${params}`)
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  return res.json()
}

export default async function SearchResults({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; tag?: string }
}) {
  const posts = await searchPosts(searchParams)

  if (posts.length === 0) {
    return <p className="mt-6">No results found.</p>
  }

  return (
    <div className="mt-6 space-y-6">
      {posts.map((post: any) => (
        <div key={post.id} className="border p-4 rounded-md">
          <Link href={`/posts/${post.id}`} className="text-xl font-semibold hover:underline">
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
  )
}