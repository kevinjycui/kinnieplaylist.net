import React, { useEffect } from 'react';

import './Login.css'
import Header from './elements/Header';

function Login() {

    useEffect(() => {
        document.title = "Login - Kinnie Playlist";
    }, [])

    return (
        <div className="App">
            <Header />
            <header className="empty">
                <a className="btn-spotify Login-button" href="/auth/login" >
                    Login with Spotify to continue
                </a>
            </header>
        </div>
    );
}

export default Login;