// app/api/youtube/search/route.ts

import { NextResponse } from 'next/server'
import { google } from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

const cache = new Map()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  // Check cache first
  if (cache.has(query)) {
    return NextResponse.json({ videoId: cache.get(query) })
  }

  try {
    const response = await youtube.search.list({
      part: ['id'],
      q: query,
      type: ['video'],
      videoEmbeddable: 'true',
      maxResults: 1
    })

    const videoId = response.data.items?.[0]?.id?.videoId

    if (!videoId) {
      return NextResponse.json({ error: 'No video found' }, { status: 404 })
    }

    // Cache the result
    cache.set(query, videoId)

    return NextResponse.json({ videoId })
  } catch (error) {
    console.error('YouTube API error:', error)
    return NextResponse.json({ error: 'Failed to search YouTube' }, { status: 500 })
  }
}
