// app/search/page.tsx
import SearchResults from '@/components/blog/SearchResults'
import prisma from '@/lib/prisma'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; tag?: string; page?: string }
}) {
  const query = searchParams.q || ''
  const category = searchParams.category || ''
  const tag = searchParams.tag || ''
  const page = parseInt(searchParams.page || '1')
  const limit = 10

  const where = {
    AND: [
      query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {},
      category ? { category: { id: category } } : {},
      tag ? { tags: { some: { name: tag } } } : {},
    ],
    published: true,
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
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
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <SearchResults
        initialPosts={posts}
        initialTotal={total}
        initialPage={page}
        initialTotalPages={totalPages}
        searchParams={searchParams}
      />
    </div>
  )
}