// components/PostPreview.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PostPreview({ post }) {
  return (
    <Card className="flex flex-col h-64">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-lg">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div className="flex items-start space-x-2">
            {post.imageUrl && (
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title} 
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-sm"
                />
              </div>
            )}
            <p className="text-sm line-clamp-3">{post.excerpt || post.content}</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm" className="self-start mt-2">
          <Link href={`/posts/${post.id}`}>Read More</Link>
        </Button>
      </CardContent>
    </Card>
  )
}