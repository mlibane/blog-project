// components\LikeButton.tsx

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
}

export default function LikeButton({ postId, initialLikeCount, initialIsLiked }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
        setIsLiked(!isLiked)
        toast({
          title: isLiked ? "Post unliked" : "Post liked",
          description: isLiked ? "You've removed your like from this post." : "You've liked this post!",
        })
      } else {
        throw new Error('Failed to update like')
      }
    } catch (error) {
      console.error('Error liking post:', error)
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLike} variant={isLiked ? "secondary" : "outline"} disabled={isLoading}>
      <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
    </Button>
  )
}