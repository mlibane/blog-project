// app/api/spotify/sse/route.ts

import { getCurrentlyPlaying } from '@/lib/spotify'
import { NextRequest } from 'next/server'

const SPOTIFY_API_URL = 'https://api.spotify.com/v1'
let accessToken: string | null = null
let tokenExpirationTime = 0

async function refreshAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    })
  })

  if (!response.ok) {
    throw new Error('Failed to refresh access token')
  }

  const data = await response.json()
  accessToken = data.access_token
  tokenExpirationTime = Date.now() + data.expires_in * 1000
}

async function getNowPlaying() {
  if (!accessToken || Date.now() > tokenExpirationTime) {
    await refreshAccessToken()
  }

  const response = await fetch(`${SPOTIFY_API_URL}/me/player/currently-playing`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (response.status === 204) {
    return { isPlaying: false }
  }

  if (!response.ok) {
    throw new Error('Failed to fetch now playing')
  }

  const data = await response.json()

  if (data.is_playing) {
    return {
      isPlaying: true,
      name: data.item.name,
      artist: data.item.artists[0].name,
      album: data.item.album.name,
      albumArt: data.item.album.images[0].url,
      trackId: data.item.id,
      progress: data.progress_ms,
      duration: data.item.duration_ms,
      timestamp: Date.now(),
    }
  }

  return { isPlaying: false }
}

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  let intervalId: NodeJS.Timeout;

  const stream = new ReadableStream({
    async start(controller) {
      intervalId = setInterval(async () => {
        try {
          const nowPlaying = await getCurrentlyPlaying(true);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(nowPlaying)}\n\n`));
        } catch (error) {
          console.error('Error in SSE stream:', error);
          if (error instanceof TypeError && error.message.includes('Controller is already closed')) {
            clearInterval(intervalId);
            return;
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`));
        }
      }, 3000);
    },
    cancel() {
      clearInterval(intervalId);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
