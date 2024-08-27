import { NextResponse } from 'next/server'
import { getCurrentlyPlaying } from '@/lib/spotify'

export async function GET() {
  try {
    const data = await getCurrentlyPlaying()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in now-playing route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}