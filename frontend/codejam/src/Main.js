import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

import WebPlayback from './WebPlayback'
import Login from './Login'

import logo from './logo.svg';
import './App.css';

function Main() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [token, setToken] = useState('');

    useEffect(() => {
      if (searchParams.has('access_token'))
      {
        localStorage.setItem('mixato-access-token', searchParams.get('access_token'))
      }

      var localToken = localStorage.getItem('mixato-access-token')

      setToken(localToken == null ? '' : localToken)

    }, []);

    return (
    <>
        { (token === '') ? <Login/> : <WebPlayback token={token} /> }
    </>
    );
}

export default Main;
