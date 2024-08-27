'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'


interface Comment {
  id: string
  content: string
  author: {
    name: string
    image?: string
  }
  createdAt: string
  parentId: string | null
  replies?: Comment[]
}

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchComments()
  }, [postId, page])

  const fetchComments = async () => {
    const response = await fetch(`/api/posts/${postId}/comments?page=${page}`)
    const data = await response.json()
    if (data.length === 0) {
      setHasMore(false)
    } else {
      setComments(prevComments => {
        const newComments = [...prevComments, ...data]
        return organizeComments(newComments)
      })
    }
  }

  const organizeComments = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>()
    const rootComments: Comment[] = []

    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    commentMap.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId)
        parent?.replies?.push(comment)
      } else {
        rootComments.push(comment)
      }
    })

    return rootComments
  }

  const handleSubmitComment = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newComment, parentId }),
    })

    if (response.ok) {
      const newCommentData = await response.json()
      setComments(prevComments => organizeComments([...prevComments, newCommentData]))
      setNewComment('')
      setReplyingTo(null)
    }
  }

  const handleEditComment = async (commentId: string, newContent: string) => {
    const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newContent }),
    })

    if (response.ok) {
      const updatedComment = await response.json()
      setComments(prevComments => 
        organizeComments(prevComments.map(c => c.id === commentId ? updatedComment : c))
      )
      setEditingComment(null)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setComments(prevComments => 
        organizeComments(prevComments.filter(c => c.id !== commentId))
      )
    }
  }

  const renderComment = (comment: Comment) => (
    <Card key={comment.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Link href={`/${comment.author.name}`}>
            <Avatar>
              <AvatarImage src={comment.author.image} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-grow">
            <Link href={`/${comment.author.name}`} className="font-semibold hover:underline">
              {comment.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
            {editingComment === comment.id ? (
              <form onSubmit={(e) => {
                e.preventDefault()
                handleEditComment(comment.id, newComment)
              }}>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mt-2"
                />
                <Button type="submit" className="mt-2">Save</Button>
                <Button onClick={() => setEditingComment(null)} variant="outline" className="mt-2 ml-2">Cancel</Button>
              </form>
            ) : (
              <p className="mt-2">{comment.content}</p>
            )}
            {session && (
              <div className="mt-2 space-x-2">
                <Button onClick={() => setReplyingTo(comment.id)} variant="outline" size="sm">Reply</Button>
                {session.user?.email === comment.author.email && (
                  <>
                    <Button onClick={() => {
                      setEditingComment(comment.id)
                      setNewComment(comment.content)
                    }} variant="outline" size="sm">Edit</Button>
                    <Button onClick={() => handleDeleteComment(comment.id)} variant="outline" size="sm">Delete</Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {replyingTo === comment.id && (
          <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="mt-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a reply..."
            />
            <Button type="submit" className="mt-2">Post Reply</Button>
            <Button onClick={() => setReplyingTo(null)} variant="outline" className="mt-2 ml-2">Cancel</Button>
          </form>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-8 mt-4">
            {comment.replies.map(renderComment)}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Comments</h2>
      {session ? (
        <form onSubmit={(e) => handleSubmitComment(e)} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button type="submit">Post Comment</Button>
        </form>
      ) : (
        <p>Please sign in to leave a comment.</p>
      )}
      <div className="space-y-4">
        {comments.map(renderComment)}
      </div>
      {hasMore && (
        <Button onClick={() => setPage(prevPage => prevPage + 1)}>
          Load More Comments
        </Button>
      )}
    </div>
  )
}