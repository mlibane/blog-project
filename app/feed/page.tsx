// app/feed/page.tsx

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function FeedPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return <div>Please sign in to view your feed.</div>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      following: {
        include: {
          posts: {
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            include: { author: true },
          },
        },
      },
    },
  })

  if (!user) {
    return <div>User not found.</div>
  }

  const feedPosts = user.following.flatMap(followedUser => followedUser.posts)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
      {feedPosts.map(post => (
        <div key={post.id} className="mb-4 p-4 border rounded">
          <Link href={`/posts/${post.id}`} className="text-xl font-semibold hover:underline">
            {post.title}
          </Link>
          <p className="text-gray-500 mt-1">By {post.author.name} on {post.createdAt.toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}