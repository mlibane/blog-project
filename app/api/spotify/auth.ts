// pages/api/spotify/auth.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSpotifyApi } from '@/lib/spotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const scopes = ['playlist-modify-private', 'playlist-read-private', 'user-read-currently-playing'];
  const spotifyApi = await getSpotifyApi();
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'some-state');
  res.redirect(authorizeURL);
}