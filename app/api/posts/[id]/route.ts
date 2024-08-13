import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: { select: { name: true, email: true } } },
  })

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await request.json()
  const { title, content, published } = json

  const existingPost = await prisma.post.findUnique({
    where: { id: params.id },
  })

  if (!existingPost) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title,
      content,
      published,
      publishedAt: published ? (existingPost.publishedAt || new Date()) : null,
    },
  })

  return NextResponse.json(post)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.post.delete({ where: { id: params.id } })

  return NextResponse.json({ message: 'Post deleted' })
}