'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  tags: string[];
}

export default function RelatedPosts({ currentPostId, tags }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      const response = await fetch(`/api/posts/related?postId=${currentPostId}&tags=${tags.join(',')}`)
      if (response.ok) {
        const data = await response.json()
        setRelatedPosts(data)
      }
    }

    fetchRelatedPosts()
  }, [currentPostId, tags])

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {relatedPosts.map(post => (
            <li key={post.id}>
              <Link href={`/posts/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}