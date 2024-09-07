// app\api\spotify\playlist-id\route.ts

import { NextResponse } from 'next/server'
import { getSpotifyApi } from '@/lib/spotify'

export async function GET() {
  try {
    const spotifyApi = await getSpotifyApi()
    const playlists = await spotifyApi.getUserPlaylists()
    const nidixPlaylist = playlists.body.items.find(playlist => playlist.name === 'Nidix')
    
    if (nidixPlaylist) {
      return NextResponse.json({ playlistId: nidixPlaylist.id })
    } else {
      return NextResponse.json({ error: 'Nidix playlist not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching playlist ID:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}