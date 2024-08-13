'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import UtterancesComments from '@/components/blog/UtterancesComments'
import Comments from '@/components/blog/Comments'
import SEO from '@/components/SEO'

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
    <>
      <SEO 
        title={`${post.title} | Your Blog Name`}
        description={post.content.substring(0, 160)}
        canonical={`/posts/${post.slug}`}
      />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-4">By {post.author.name}</p>
        {session && (
          <div className="mb-4">
            <button 
              onClick={handleSave} 
              disabled={isSaved}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              {isSaved ? 'Saved' : 'Save for Later'}
            </button>
            <button 
              onClick={handleMarkAsRead} 
              disabled={isRead}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {isRead ? 'Read' : 'Mark as Read'}
            </button>
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose lg:prose-xl mb-8" />
        
        <h2 className="text-2xl font-bold mb-4">GitHub Comments</h2>
        <UtterancesComments
          repo="your-username/your-repo-name"
          issueTerm={`Post: ${post.slug}`}
          label="comments"
        />
        
        <Comments postId={post.id} />
      </div>
    </>
  )
}