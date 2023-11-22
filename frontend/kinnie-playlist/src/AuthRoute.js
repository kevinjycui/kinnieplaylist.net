import React, { useState, useEffect, createContext } from 'react';
import { useSearchParams } from "react-router-dom";

import WebPlayback, { track } from './elements/WebPlayback'
import Login from './Login'

import './App.css';
import { spotifyRefreshToken } from './api/apiUtil';

export const TokenContext = createContext(null);
export const RefreshTokenContext = createContext(null);

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
      setSearchParams(searchParams);
    }

    setRefreshToken(localStorage.getItem('kinnie-refresh-token') ?? '');

    if (searchParams.has('access_token')) {
      const now = new Date();
      localStorage.setItem('kinnie-access-token', JSON.stringify(
        {
          value: searchParams.get('access_token'),
          expiry: now.getTime() + (searchParams.get('expires_in') ?? 3600)
        }))
      searchParams.delete('access_token');
      searchParams.delete('expires_in');
      setSearchParams(searchParams);
    }

    if (localStorage.getItem('kinnie-access-token') === null && refreshToken !== '') {
      spotifyRefreshToken(setToken, refreshToken);
    }

    setToken(localStorage.getItem('kinnie-access-token') ?? '');

  }, [token, setToken, refreshToken, searchParams, setSearchParams, setPlayer, setTrack]);

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
