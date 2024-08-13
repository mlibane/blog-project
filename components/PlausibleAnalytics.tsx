'use client'

import Script from 'next/script'

const PlausibleAnalytics = () => {
  return (
    <Script
      src="https://plausible.io/js/script.js"
      data-domain="nidix.xyz"
      strategy="afterInteractive"
    />
  )
}

export default PlausibleAnalytics