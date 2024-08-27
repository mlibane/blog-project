// components\SEO.tsx

import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
}

const SEO: React.FC<SEOProps> = ({ title, description, canonical, ogImage }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nidix.xyz'
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl
  const ogImageUrl = ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/default-og-image.jpg`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Head>
  )
}

export default SEO