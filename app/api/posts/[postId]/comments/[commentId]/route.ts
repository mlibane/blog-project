// app\api\posts\[postId]\comments\[commentId]\route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"

export async function PUT(
  request: Request,
  { params }: { params: { postId: string, commentId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await request.json()
  const { content } = json

  const comment = await prisma.comment.update({
    where: { id: params.commentId },
    data: { content },
    include: { author: { select: { name: true, image: true } } },
  })

  return NextResponse.json(comment)
}

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string, commentId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.comment.delete({
    where: { id: params.commentId },
  })

  return NextResponse.json({ message: 'Comment deleted successfully' })
}