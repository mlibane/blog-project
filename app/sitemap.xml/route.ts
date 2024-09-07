// app/sitemap.xml/route.ts

import prisma from '@/lib/prisma'

export async function GET() {
  let posts: any[] = []

  try {
    posts = await prisma.post.findMany({ 
      where: { published: true },
      select: { slug: true, updatedAt: true } 
    })
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nidix.xyz'

  const staticPages = [
    '',
    '/about',
    '/contact',
    '/posts',
    '/create-post',
    '/auth/signin',
    '/auth/signup'
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages.map(page => `
        <url>
          <loc>${baseUrl}${page}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
          <priority>${page === '' ? '1.0' : '0.8'}</priority>
        </url>
      `).join('')}
      ${posts.map(post => `
        <url>
          <loc>${baseUrl}/posts/${post.slug}</loc>
          <lastmod>${post.updatedAt.toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  })
}