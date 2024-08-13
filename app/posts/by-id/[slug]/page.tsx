'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import UtterancesComments from '@/components/blog/UtterancesComments'
import Comments from '@/components/blog/Comments'
import SEO from '@/components/SEO'

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  })
  if (!post) notFound()
  return post
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [post, setPost] = useState<any>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isRead, setIsRead] = useState(false)

  useEffect(() => {
    getPost(params.postId).then(setPost)
  }, [params.postId])

  useEffect(() => {
    if (session) {
      fetch('/api/user/preferences')
        .then(res => res.json())
        .then(data => {
          setIsSaved(data.savedPosts.some((p: any) => p.id === params.postId))
          setIsRead(data.readPosts.some((p: any) => p.id === params.postId))
        })
    }
  }, [session, params.postId])

  const handleSave = async () => {
    const res = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'savePost', postId: params.postId }),
    })
    if (res.ok) setIsSaved(true)
  }

  const handleMarkAsRead = async () => {
    const res = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markAsRead', postId: params.postId }),
    })
    if (res.ok) setIsRead(true)
  }

  if (!post) return <div>Loading...</div>

  return (
    <>
      <SEO 
        title={`${post.title} | Your Blog Name`}
        description={post.content.substring(0, 160)}
        canonical={`/posts/${post.id}`}
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
          issueTerm={`Post: ${post.id}`}
          label="comments"
        />
        
        <Comments postId={post.id} />
      </div>
    </>
  )
}