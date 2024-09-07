// app/api/users/[username]/follow/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import prisma from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
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

  const { username } = params

  if (!username) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
  }

  try {
    const userToFollow = await prisma.user.findUnique({
      where: { name: username },
    })

    if (!userToFollow) {
      return NextResponse.json({ error: 'User to follow not found' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: userToFollow.id },
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
  { params }: { params: { username: string } }
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

  const { username } = params

  try {
    const userToUnfollow = await prisma.user.findUnique({
      where: { name: username },
    })

    if (!userToUnfollow) {
      return NextResponse.json({ error: 'User to unfollow not found' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: userToUnfollow.id },
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