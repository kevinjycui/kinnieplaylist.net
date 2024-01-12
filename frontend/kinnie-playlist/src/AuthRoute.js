import React, { useState, useEffect, createContext } from 'react';
import { useSearchParams } from "react-router-dom";

import Header from './elements/Header';
import WebPlayback, { track } from './elements/WebPlayback'
import Login from './Login'

import './App.css';
import { spotifyCheckRefreshToken } from './api/apiUtil';

export const TokenContext = createContext('');
export const RefreshTokenContext = createContext('');

export const TrackContext = createContext(track);
export const PlayerContext = createContext(null);
export const PremiumContext = createContext(false);

function AuthRoute({ content, is_webplayer_active }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const [current_track, setTrack] = useState(track);
  const [player, setPlayer] = useState(undefined);
  const [is_premium, setPremium] = useState(true);

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
          expiry: now.getTime() + (parseInt(searchParams.get('expires_in') ?? '3600') * 1000)
        }))
      searchParams.delete('access_token');
      searchParams.delete('expires_in');
      setSearchParams(searchParams);
    }

    spotifyCheckRefreshToken(setToken, refreshToken);

  }, [token, setToken, refreshToken, searchParams, setSearchParams, setPlayer, setTrack]);

  return (
    <>
      <RefreshTokenContext.Provider value={[refreshToken, setRefreshToken]}>
        <TokenContext.Provider value={[token, setToken]}>
          <PlayerContext.Provider value={[player, setPlayer]}>
            {(refreshToken === '') ? <Login />
              : <div>
                <TrackContext.Provider value={[current_track, setTrack]}>
                  <PremiumContext.Provider value={[is_premium, setPremium]}>
                    <Header />
                    {content}
                    {(is_webplayer_active ?? true) ? <WebPlayback /> : <></>}
                  </PremiumContext.Provider>
                </TrackContext.Provider>
              </div>}
          </PlayerContext.Provider>
        </TokenContext.Provider>
      </RefreshTokenContext.Provider>
    </>
  );
}

export default AuthRoute;
