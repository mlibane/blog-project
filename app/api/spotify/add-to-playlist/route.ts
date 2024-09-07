// app/api/spotify/add-to-playlist/route.ts

import { NextResponse } from 'next/server'
import { addToNidixPlaylist } from '@/lib/spotify'

export async function POST(request: Request) {
  try {
    const { trackId } = await request.json()
    const result = await addToNidixPlaylist(trackId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in add-to-playlist route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}