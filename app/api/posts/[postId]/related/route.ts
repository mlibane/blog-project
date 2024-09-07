// app\api\posts\[postId]\related\route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  const tagIds = searchParams.get('tags')?.split(',') || []

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
  }

  try {
    const relatedPosts = await prisma.post.findMany({
      where: {
        id: { not: postId },
        tags: {
          some: {
            id: { in: tagIds }
          }
        },
        published: true
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
    })

    return NextResponse.json(relatedPosts)
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return NextResponse.json({ error: 'Failed to fetch related posts' }, { status: 500 })
  }
}