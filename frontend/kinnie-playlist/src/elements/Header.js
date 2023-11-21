import React from 'react';
import { useNavigate } from "react-router-dom";

import "./Header.css"

function Header() {
    const navigate = useNavigate();

    function handleClick() {
        navigate('/');
    }

    return (
        <header className="Header">
            <button className="Header-button" onClick={handleClick}><img className="logo" alt="Kinnie Playlist logo" src="/kinnieplaylistlogo.svg" /></button>
        </header>
    );
}

export default Header;