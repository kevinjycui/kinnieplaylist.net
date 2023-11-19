import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

import Home from './Home'
import WebPlayback from './WebPlayback'
import Login from './Login'

import logo from './logo.svg';
import './App.css';

function AuthRoute(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [token, setToken] = useState('');

    useEffect(() => {
      if (searchParams.has('access_token'))
      {
        localStorage.setItem('musato-access-token', searchParams.get('access_token'))
        searchParams.delete('access_token');
        setSearchParams(searchParams);
      }

      var localToken = localStorage.getItem('musato-access-token')

      setToken(localToken == null ? '' : localToken)

    }, []);

    return (
    <>
        { (token === '') ? <Login/> : <div>
        {props.content}
        <WebPlayback token={token} />
         </div> }
    </>
    );
}

export default AuthRoute;
