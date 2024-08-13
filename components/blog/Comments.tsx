'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Comment {
  id: string
  content: string
  author: {
    name: string
    email: string
  }
  createdAt: string
}

interface CommentsProps {
  postId: string
}

const CommentItem = React.memo(({ comment }: { comment: Comment }) => (
    <div key={comment.id} className="border p-4 rounded-md">
      <p>{comment.content}</p>
      <p className="text-sm text-gray-500 mt-2">
        By {comment.author.name} on {new Date(comment.createdAt).toLocaleDateString()}
      </p>
    </div>
  ))

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const { data: session } = useSession()

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    const response = await fetch(`/api/posts/${postId}/comments`)
    const data = await response.json()
    setComments(data)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newComment }),
    })

    if (response.ok) {
      setNewComment('')
      fetchComments()
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="mb-2"
          />
          <Button type="submit">Post Comment</Button>
        </form>
      ) : (
        <p className="mb-4">Please sign in to leave a comment.</p>
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border p-4 rounded-md">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              By {comment.author.name} on {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Comments