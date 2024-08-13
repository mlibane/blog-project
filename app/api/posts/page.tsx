import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'

async function getPosts(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip,
  })
  const total = await prisma.post.count({ where: { published: true } })
  return { posts, total }
}

export default async function BlogList({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const limit = 10
  const { posts, total } = await getPosts(page, limit)
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-md">
            <Link href={`/posts/${post.id}`} className="text-xl font-semibold hover:underline">
              {post.title}
            </Link>
            <p className="text-gray-500 mt-2">By {post.author.name}</p>
            <p className="mt-2">{post.content.substring(0, 150)}...</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <Button
          disabled={page <= 1}
          onClick={() => window.location.href = `/posts?page=${page - 1}`}
        >
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button
          disabled={page >= totalPages}
          onClick={() => window.location.href = `/posts?page=${page + 1}`}
        >
          Next
        </Button>
      </div>
    </div>
  )
}