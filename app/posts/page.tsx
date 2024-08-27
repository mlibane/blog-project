// app/posts/page.tsx

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import prisma from '@/lib/prisma'
import { truncateHtml } from '@/lib/utils'

export default async function Posts() {
  const session = await getServerSession(authOptions)
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-4xl font-bold">Blog Posts</h1>
        {session && (
          <Button asChild>
            <Link href="/create-post">Create New Post</Link>
          </Button>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle className="font-serif">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div className="mb-4" dangerouslySetInnerHTML={{ __html: truncateHtml(post.content, 100) }} />
              <Button asChild>
                <Link href={`/posts/${post.id}`}>Read More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}