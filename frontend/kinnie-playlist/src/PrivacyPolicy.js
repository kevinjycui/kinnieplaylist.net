import React, { useEffect } from 'react';

import Header from './elements/Header';

function Login() {

    useEffect(() => {
        document.title = "Privacy Policy - Kinnie Playlist";
    }, [])

    return (
        <div className="App">
            <header className="empty">
                <h2>Privacy Policy</h2>
                <p><b>Kinnie Playlist</b> does not store any personal data, including Spotify user data such as email and display name, other than Spotify user ID to track votes.</p>
            </header>
        </div>
    );
}

export default Login;