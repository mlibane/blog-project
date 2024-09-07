// app/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { getLatestPosts } from '@/lib/posts'
import Hero from '@/components/Hero'

export default async function Home() {
  const latestPosts = await getLatestPosts(3)

  return (
    <div className="space-y-24">
      <Hero />
      
      <section>
        <h2 className="font-cabinet-grotesk text-3xl font-semibold mb-8">Latest Posts</h2>
        {latestPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Card key={post.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-cabinet-grotesk text-2xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="font-satoshi text-muted-foreground mb-6">
                    {post.excerpt}
                  </p>
                  <p className="font-satoshi text-sm text-muted-foreground mb-4">
                    By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <Button asChild variant="ghost">
                    <Link href={`/posts/${post.id}`}>Read More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No posts available at the moment. Damn...🥺 </p>
        )}
      </section>
    </div>
  )
}