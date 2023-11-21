import React, { useState, useEffect, createContext } from 'react';
import { useSearchParams } from "react-router-dom";

import WebPlayback from './elements/WebPlayback'
import Login from './Login'

import './App.css';
import { spotifyRefreshToken } from './api/apiUtil';

export const TokenContext = createContext(null);
export const RefreshTokenContext = createContext(null);

function AuthRoute({ content }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');

    useEffect(() => {
      if (searchParams.has('refresh_token'))
      {
        localStorage.setItem('kinnie-refresh-token', searchParams.get('refresh_token'))
        searchParams.delete('refresh_token');
      }

      if (searchParams.has('access_token'))
      {
        localStorage.setItem('kinnie-access-token', searchParams.get('access_token'))
        searchParams.delete('access_token');
      }
      setSearchParams(searchParams);

      setToken(localStorage.getItem('kinnie-access-token') ?? '');
      setRefreshToken(localStorage.getItem('kinnie-refresh-token') ?? '');

    }, []);

    return (
    <>
        { (refreshToken === '') ? <Login/> : <div>
          <RefreshTokenContext.Provider value={refreshToken}>
            <TokenContext.Provider value={[token, setToken]}>
                {content}
                <WebPlayback />
            </TokenContext.Provider>
          </RefreshTokenContext.Provider>
         </div> }
    </>
    );
}

export default AuthRoute;
