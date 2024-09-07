// components/FollowButton.tsx

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

interface FollowButtonProps {
  id: string
  initialIsFollowing: boolean
  onFollowChange: (isFollowing: boolean) => void
}

export default function FollowButton({ id, initialIsFollowing, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const handleFollow = async () => {
    if (!session) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${id}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        const newFollowState = !isFollowing
        setIsFollowing(newFollowState)
        onFollowChange(newFollowState)
      } else {
        const errorData = await response.json()
        console.error('Failed to update follow status:', errorData.error)
      }
    } catch (error) {
      console.error('Error updating follow status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleFollow} disabled={isLoading}>
      {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}