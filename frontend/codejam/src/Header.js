import React from 'react';
import { useNavigate } from "react-router-dom";

import "./Header.css"

function Header() {
    const navigate = useNavigate();
    
    function handleClick()
    {
        navigate('/');
    }

    return (
        <header>
            <button onClick={handleClick}><img className="logo" src="kinnieplaylistlogo.svg"/></button>
            {/* <img className="Header-spotify" src='spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Green.png' /> */}
        </header>
    );
}

export default Header;