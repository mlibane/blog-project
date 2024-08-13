import Link from 'next/link'
import prisma from '@/lib/prisma'

async function getLatestPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { author: { select: { name: true } } },
  })
  return posts
}

export default async function LatestPosts() {
  const posts = await getLatestPosts()

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-md">
            <Link href={`/posts/${post.id}`} className="text-xl font-semibold hover:underline">
              {post.title}
            </Link>
            <p className="text-gray-500 mt-2">By {post.author.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}