import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')

  if (!query && !category && !tag) {
    return NextResponse.json({ error: 'No search parameters provided' }, { status: 400 })
  }

  const posts = await prisma.post.findMany({
    where: {
      AND: [
        {
          OR: [
            { title: { contains: query || '', mode: 'insensitive' } },
            { content: { contains: query || '', mode: 'insensitive' } },
          ],
        },
        category ? { category: { name: category } } : {},
        tag ? { tags: { some: { name: tag } } } : {},
      ],
      published: true,
    },
    include: {
      author: {
        select: { name: true },
      },
      category: true,
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(posts)
}