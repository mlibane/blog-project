// app\api\posts\[postId]\route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: { author: { select: { name: true, email: true } } },
  })

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PUT(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await request.json()
  const { title, content, published } = json

  const post = await prisma.post.update({
    where: { slug: params.slug },
    data: {
      views: {
        increment: 1,
      },
    },
    include: { 
      author: { select: { name: true } },
      likes: true,
      comments: true,
    },
  })
  

  return NextResponse.json(post)
}

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.post.delete({ where: { id: params.postId } })

  return NextResponse.json({ message: 'Post deleted' })
}