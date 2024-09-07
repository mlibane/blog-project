// app\api\users\[username]\route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        name: {
          equals: params.username,
          mode: 'insensitive'
        }
      },
      include: {
        posts: {
          where: { published: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        followers: {
          select: { email: true }
        },
        following: {
          select: { email: true }
        },
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}