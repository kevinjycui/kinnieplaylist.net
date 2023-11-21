import React, { useState, useEffect, createContext } from 'react';
import { useSearchParams } from "react-router-dom";

import WebPlayback from './elements/WebPlayback'
import Login from './Login'

import './App.css';
import { spotifyRefreshToken } from './api/apiUtil';

export const TokenContext = createContext(null);
export const RefreshTokenContext = createContext(null);

const track = {
  name: "Connect to Spotify and play on device \"Kinnie Playlist Web Playback\"",
  album: {
    images: [
      { url: "" }
    ]
  },
  artists: [
    { name: "" }
  ],
  id: ""
}

export const TrackContext = createContext(track);
export const PlayerContext = createContext(null);

function AuthRoute({ content }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const [current_track, setTrack] = useState(track);
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    if (searchParams.has('refresh_token')) {
      localStorage.setItem('kinnie-refresh-token', searchParams.get('refresh_token'))
      searchParams.delete('refresh_token');
    }

    if (searchParams.has('access_token')) {
      localStorage.setItem('kinnie-access-token', searchParams.get('access_token'))
      searchParams.delete('access_token');

      setInterval(() => spotifyRefreshToken(setToken, refreshToken), 3540);
    }
    setSearchParams(searchParams);

    setToken(localStorage.getItem('kinnie-access-token') ?? '');
    setRefreshToken(localStorage.getItem('kinnie-refresh-token') ?? '');
  }, []);

  return (
    <>
      {(refreshToken === '') ? <Login /> : <div>
        <RefreshTokenContext.Provider value={refreshToken}>
          <TokenContext.Provider value={[token, setToken]}>
            <PlayerContext.Provider value={[player, setPlayer]}>
              <TrackContext.Provider value={[current_track, setTrack]}>
                {content}
                <WebPlayback />
              </TrackContext.Provider>
            </PlayerContext.Provider>
          </TokenContext.Provider>
        </RefreshTokenContext.Provider>
      </div>}
    </>
  );
}

export default AuthRoute;
