import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
})

let tokenExpirationTime = 0

async function refreshAccessToken() {
  try {
    const data = await spotifyApi.refreshAccessToken()
    spotifyApi.setAccessToken(data.body['access_token'])
    tokenExpirationTime = Date.now() + data.body['expires_in'] * 1000
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw error
  }
}

export async function getSpotifyApi() {
  if (Date.now() > tokenExpirationTime) {
    await refreshAccessToken()
  }
  return spotifyApi
}

export async function getCurrentlyPlaying() {
  try {
    const api = await getSpotifyApi()
    const data = await api.getMyCurrentPlaybackState()
    if (data.body && data.body.is_playing) {
      const track = data.body.item
      return {
        isPlaying: true,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        albumArt: track.album.images[0].url,
        trackId: track.id,
        duration: track.duration_ms,
        progress: data.body.progress_ms,
      }
    } else {
      return { isPlaying: false }
    }
  } catch (error) {
    console.error('Error getting currently playing:', error)
    return { isPlaying: false, error: 'Failed to fetch currently playing track' }
  }
}

export async function addToNidixPlaylist(trackId: string) {
  try {
    const api = await getSpotifyApi()
    const playlists = await api.getUserPlaylists()
    let nidixPlaylist = playlists.body.items.find(playlist => playlist.name === 'Nidix')
    
    if (!nidixPlaylist) {
      const newPlaylist = await api.createPlaylist('Nidix', { description: 'Created by Nidix app', public: false })
      nidixPlaylist = newPlaylist.body
    }

    await api.addTracksToPlaylist(nidixPlaylist.id, [`spotify:track:${trackId}`])
    return { success: true }
  } catch (error) {
    console.error('Error adding to Nidix playlist:', error)
    return { success: false, error: 'Failed to add track to playlist' }
  }
}