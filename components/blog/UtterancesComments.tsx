// components\blog\UtterancesComments.tsx

'use client'

import React, { useEffect, useRef } from 'react'

interface UtterancesCommentsProps {
  repo: string
  issueTerm: string
  label?: string
  theme?: string
}

const UtterancesComments: React.FC<UtterancesCommentsProps> = ({ repo, issueTerm, label, theme = 'github-light' }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    const attributes = {
      src: 'https://utteranc.es/client.js',
      repo,
      'issue-term': issueTerm,
      label,
      theme,
      crossOrigin: 'anonymous',
      async: 'true'
    }
    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value as string)
    })
    
    const currentContainer = containerRef.current
    currentContainer?.appendChild(script)

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = ''
      }
    }
  }, [repo, issueTerm, label, theme])

  return <div ref={containerRef} />
}

UtterancesComments.displayName = 'UtterancesComments'

export default UtterancesComments