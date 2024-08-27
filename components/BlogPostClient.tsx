// components\BlogPostClient.tsx

'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import UtterancesComments from '@/components/blog/UtterancesComments'
import Comments from '@/components/blog/Comments'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'


export default function BlogPostClient({ post }: { post: any }) {
  const { data: session } = useSession()
  const [isSaved, setIsSaved] = useState(false)
  const [isRead, setIsRead] = useState(false)

  useEffect(() => {
    if (session) {
      fetch('/api/user/preferences')
        .then(res => res.json())
        .then(data => {
          setIsSaved(data.savedPosts.some((p: any) => p.id === post.id))
          setIsRead(data.readPosts.some((p: any) => p.id === post.id))
        })
    }
  }, [session, post.id])

  const handleSave = async () => {
    const res = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'savePost', postId: post.id }),
    })
    if (res.ok) setIsSaved(true)
  }

  const handleMarkAsRead = async () => {
    const res = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markAsRead', postId: post.id }),
    })
    if (res.ok) setIsRead(true)
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-4">By {post.author.name}</p>
      {session && (
        <div className="mb-4">
          <Button onClick={handleSave} disabled={isSaved}>
            {isSaved ? 'Saved' : 'Save for Later'}
          </Button>
          <Button onClick={handleMarkAsRead} disabled={isRead} className="ml-2">
            {isRead ? 'Read' : 'Mark as Read'}
          </Button>
        </div>
      )}
      {post.imageUrl && (
        <Image 
          src={post.imageUrl} 
          alt={post.title} 
          width={1200} 
          height={630} 
          loading="lazy"
          className="mb-4"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose lg:prose-xl mb-8" />
      
      <section>
        <h2 className="text-2xl font-bold mb-4">GitHub Comments</h2>
        <UtterancesComments
          repo="your-username/your-repo-name"
          issueTerm={`Post: ${post.slug}`}
          label="comments"
        />
      </section>
      
      <Comments postId={post.id} />
    </article>
  )
}