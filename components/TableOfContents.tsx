'use client'

import { useEffect, useState } from 'react'
import { Link } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TOCItem[]>([])

  useEffect(() => {
    const article = document.querySelector('article')
    if (article) {
      const headings = article.querySelectorAll('h2, h3, h4')
      const tocItems = Array.from(headings).map((heading) => ({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      }))
      setToc(tocItems)
    }
  }, [])

  if (toc.length === 0) return null

  return (
    <nav className="toc">
      <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 12}px` }}>
            
              href={`#${item.id}`}
              className="text-blue-500 hover:underline flex items-center"
            >
              <Link className="h-4 w-4 mr-1" />
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}