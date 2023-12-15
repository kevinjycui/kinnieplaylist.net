import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";

import logo2 from "../logo2.svg";

import "./Header.css"
import { PlayerContext, RefreshTokenContext, TokenContext } from '../AuthRoute';

function Header() {
    const navigate = useNavigate();

    const [token, setToken] = useContext(TokenContext);
    const [refreshToken, setRefreshToken] = useContext(RefreshTokenContext);
    const [player, setPlayer] = useContext(PlayerContext);

    function logout() {
        setToken('');
        setRefreshToken('');
        localStorage.removeItem('kinnie-access-token');
        localStorage.removeItem('kinnie-refresh-token');
        player.disconnect();
        setPlayer(null);
    }

    return (
        <header className="Header">
            <button title="https://kinnieplaylist.net/" className="Header-button" onClick={() => navigate("/")}><img className="logo" alt="Kinnie Playlist" src={logo2} />
                character playlist database for
                <img className="spotify-logo" alt='Spotify' src='/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Black.png' />
            </button>
            <nav className="Header-nav-container">
                <button title="https://kinnieplaylist.net/latest" className="Header-nav" onClick={() => navigate("/latest")}>
                    latest
                </button>
                <button title="https://kinnieplaylist.net/random" className="Header-nav" onClick={() => navigate("/random")}>
                    random
                </button>
                <button title="https://kinnieplaylist.net/profile" className="Header-nav" onClick={() => navigate("/profile")}>
                    my tracks  
                </button>
                <a className="Header-nav" href="https://forms.gle/2RL1aLtntu9qhjo77" target="_blank" rel="noreferrer">
                    join waitlist
                </a>
                {token !== '' && refreshToken !== '' ?
                    <button className="Header-nav" onClick={logout}>
                        logout
                    </button> : <></>
                }
            </nav>
        </header>
    );
}

export default Header;