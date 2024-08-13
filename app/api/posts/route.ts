import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit

  const posts = await prisma.post.findMany({
    skip,
    take: limit,
    where: { published: true },
    include: { author: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.post.count({ where: { published: true } })

  const response = NextResponse.json({ posts, total, page, limit })
  response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate')
  return response
}


export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await request.json()
  const { title, content, published } = json

  const post = await prisma.post.create({
    data: {
      title,
      content,
      published,
      publishedAt: published ? new Date() : null,
      author: { connect: { email: session.user?.email! } },
    },
  })

  return NextResponse.json(post)
}