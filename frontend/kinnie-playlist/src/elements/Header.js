import React from 'react';
import { useNavigate } from "react-router-dom";

import logo2 from "../logo2.svg";

import "./Header.css"

function Header({ position }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate('/');
    }

    return (
        <header className="Header">
            <button style={{ position: position }} className="Header-button" onClick={handleClick}><img className="logo" alt="Kinnie Playlist logo" src={logo2} /> beta</button>
        </header>
    );
}

export default Header;