import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      savedPosts: { select: { slug: true, title: true } },
      readPosts: { select: { slug: true, title: true } },
      preferredCategories: { select: { slug: true, name: true } },
    },
  })

  return NextResponse.json(user)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action, postId, categoryId } = await request.json()

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  switch (action) {
    case 'savePost':
      await prisma.user.update({
        where: { slug: user.slug },
        data: { savedPosts: { connect: { slug: postId } } },
      })
      break
    case 'markAsRead':
      await prisma.user.update({
        where: { slug: user.slug },
        data: { readPosts: { connect: { id: postId } } },
      })
      break
    case 'setPreferredCategory':
      await prisma.user.update({
        where: { slug: user.slug },
        data: { preferredCategories: { connect: { id: categoryId } } },
      })
      break
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}