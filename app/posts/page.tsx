'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Post {
  id: string
  title: string
  author: {
    name: string
  }
  content: string
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data.posts))
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border p-4 rounded-md"
          >
            <Link href={`/posts/${post.id}`} className="text-xl font-semibold hover:underline">
              {post.title}
            </Link>
            <p className="text-gray-500 mt-2">By {post.author.name}</p>
            <p className="mt-2">{post.content.substring(0, 150)}...</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}