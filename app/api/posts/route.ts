// app\api\posts\route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import slugify from 'slugify'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, categoryId, tags } = body

    const slug = slugify(title, { lower: true, strict: true })

    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        author: { connect: { email: session.user.email } },
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        category: true,
        tags: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the post' },
      { status: 500 }
    )
  }
}