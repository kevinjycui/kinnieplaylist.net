import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

import Home from './Home'
import Login from './Login'

import logo from './logo.svg';
import './App.css';

function AuthRoute() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [token, setToken] = useState('');

    useEffect(() => {
      if (searchParams.has('access_token'))
      {
        localStorage.setItem('musato-access-token', searchParams.get('access_token'))
      }

      var localToken = localStorage.getItem('musato-access-token')

      setToken(localToken == null ? '' : localToken)

    }, []);

    return (
    <>
        { (token === '') ? <Login/> : <Home /> }
    </>
    );
}

export default AuthRoute;
