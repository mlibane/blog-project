// components/blog/LatestPosts.tsx
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LatestPosts() {
  const posts = [
    { id: 1, title: "Post Title", content: "Lorem ipsum dolor sit amet...", author: "Author Name", date: "18/08/2024" },
    { id: 2, title: "Post Title", content: "Lorem ipsum dolor sit amet...", author: "Author Name", date: "18/08/2024" },
    { id: 3, title: "Post Title", content: "Lorem ipsum dolor sit amet...", author: "Author Name", date: "18/08/2024" },
  ]

  return (
    <section>
      <h2 className="font-serif text-3xl font-semibold mb-8">Latest Posts</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-serif">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between flex-grow">
              <p className="text-muted-foreground mb-4">{post.content}</p>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  By {post.author} on {post.date}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/posts/${post.id}`}>Read More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}