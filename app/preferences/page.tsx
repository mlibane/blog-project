// app\preferences\page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface UserPreferences {
  savedPosts: Array<{ id: string; title: string }>
  readPosts: Array<{ id: string; title: string }>
  preferredCategories: Array<{ id: string; name: string }>
}

export default function UserPreferences() {
  const { data: session } = useSession()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)

  useEffect(() => {
    if (session) {
      fetch('/api/user/preferences')
        .then(res => res.json())
        .then(data => setPreferences(data))
    }
  }, [session])

  if (!session) {
    return <div>Please sign in to view your preferences.</div>
  }

  if (!preferences) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Preferences</h1>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">Saved Posts</h2>
      <ul>
        {preferences.savedPosts.map(post => (
          <li key={post.id} className="mb-2">
            <Link href={`/posts/${post.id}`} className="text-blue-500 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Reading History</h2>
      <ul>
        {preferences.readPosts.map(post => (
          <li key={post.id} className="mb-2">
            <Link href={`/posts/${post.id}`} className="text-blue-500 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Preferred Categories</h2>
      <ul>
        {preferences.preferredCategories.map(category => (
          <li key={category.id} className="mb-2">{category.name}</li>
        ))}
      </ul>
    </div>
  )
}