import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import prisma from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const follower = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })

  if (!follower) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { userId } = params

  if (!userId) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  try {
    const userToFollow = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!userToFollow) {
      return NextResponse.json({ error: 'User to follow not found' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        followers: {
          connect: { id: follower.id }
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error following user:', error)
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const follower = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })

  if (!follower) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  try {
    await prisma.user.update({
      where: { id: params.userId },
      data: {
        followers: {
          disconnect: { id: follower.id }
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 })
  }
}