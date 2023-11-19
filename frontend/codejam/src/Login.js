import React from 'react';

import './Login.css'

function Login() {
    return (
        <div className="App">
            <header className="App-header">
                <a className="btn-spotify Login-button" href="/auth/login" >
                    Login with Spotify 
                </a>
            </header>
        </div>
    );
}

export default Login;