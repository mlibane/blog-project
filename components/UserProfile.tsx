// components/UserProfile.tsx

'use client'

import { useState } from 'react'
import { User, Post } from '@prisma/client'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import FollowButton from './FollowButton'

interface UserProfileProps {
  user: User & { followers: User[], following: User[], posts: Post[] }
  isOwnProfile: boolean
  isFollowing: boolean
  sessionUserId?: string
}

export default function UserProfile({ user, isOwnProfile, isFollowing, sessionUserId }: UserProfileProps) {
  const [following, setFollowing] = useState(isFollowing)

  const handleFollowChange = (newFollowState: boolean) => {
    setFollowing(newFollowState)
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.image || ''} alt={user.name || ''} />
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      {!isOwnProfile && sessionUserId && (
        <FollowButton
          username={user.name || ''}
          initialIsFollowing={following}
          onFollowChange={handleFollowChange}
        />
      )}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        {user.posts.map(post => (
          <Link href={`/posts/${post.id}`} key={post.id} className="block mb-2 hover:underline">
            {post.title}
          </Link>
        ))}
      </div>
      <div className="mt-8 flex space-x-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Followers ({user.followers.length})</h2>
          {user.followers.map(follower => (
            <Link href={`/${follower.name}`} key={follower.id} className="block hover:underline">
              {follower.name}
            </Link>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Following ({user.following.length})</h2>
          {user.following.map(following => (
            <Link href={`/${following.name}`} key={following.id} className="block hover:underline">
              {following.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}