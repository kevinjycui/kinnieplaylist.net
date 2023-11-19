import React, { useState, useEffect, createContext } from 'react';
import { useSearchParams } from "react-router-dom";

import WebPlayback from './WebPlayback'
import Login from './Login'

import './App.css';

export const TokenContext = createContext(null);

function AuthRoute(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [token, setToken] = useState('');

    useEffect(() => {
      if (searchParams.has('access_token'))
      {
        localStorage.setItem('kinnieplaylist-access-token', searchParams.get('access_token'))
        searchParams.delete('access_token');
        setSearchParams(searchParams);
      }

      var localToken = localStorage.getItem('kinnieplaylist-access-token')

      setToken(localToken == null ? '' : localToken)

    }, []);

    return (
    <>
        { (token === '') ? <Login/> : <div>
        <TokenContext.Provider value={token}>
            {props.content}
            <WebPlayback />
        </TokenContext.Provider>
         </div> }
    </>
    );
}

export default AuthRoute;
