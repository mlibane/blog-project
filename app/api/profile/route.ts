// app\api\profile\route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { name: true, image: true, settings: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { name, image, settings } = user
    const { bio, location, website, twitter, github } = settings as { 
      bio?: string, 
      location?: string, 
      website?: string,
      twitter?: string,
      github?: string
    } || {}

    return NextResponse.json({ name, image, bio, location, website, twitter, github })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { name, bio, location, website, twitter, github, image } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        image,
        settings: {
          bio,
          location,
          website,
          twitter,
          github,
        },
      },
    })

    return NextResponse.json({
      name: updatedUser.name,
      image: updatedUser.image,
      bio,
      location,
      website,
      twitter,
      github,
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}