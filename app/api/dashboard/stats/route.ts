// app\api\dashboard\stats\route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        author: { email: session.user.email },
        published: true,
      },
      select: {
        id: true,
        title: true,
        views: true,
        likes: { select: { id: true }, },
        comments: { select: { id: true }, },
      },
    })

    const stats = posts.map(post => ({
      id: post.id,
      title: post.title,
      views: post.views || 0,
      likes: post.likes.length,
      comments: post.comments.length,
    }))

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}