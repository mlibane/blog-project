import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 10

  const comments = await prisma.comment.findMany({
    where: { postId: params.postId },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  return NextResponse.json(comments)
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await request.json()
  const { content } = json

  const comment = await prisma.comment.create({
    data: {
      content,
      author: { connect: { email: session.user?.email! } },
      post: { connect: { id: params.postId } },
    },
    include: { author: { select: { name: true, image: true } } },
  })

  return NextResponse.json(comment)
}