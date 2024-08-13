'use client'

import React, { useEffect, useRef } from 'react'

interface UtterancesCommentsProps {
  repo="mlibane/nidix"
  issue-term="pathname"
  label?: string
  theme="github-light"
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
      script.setAttribute(key, value)
    })
    containerRef.current?.appendChild(script)

    return () => {
      containerRef.current?.innerHTML = ''
    }
  }, [repo, issueTerm, label, theme])

  return <div ref={containerRef} />
}

export default UtterancesComments