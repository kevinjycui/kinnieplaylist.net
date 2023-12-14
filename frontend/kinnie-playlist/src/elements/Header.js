import React from 'react';
import { useNavigate } from "react-router-dom";

import logo2 from "../logo2.svg";

import "./Header.css"

function Header() {
    const navigate = useNavigate();

    function handleClick() {
        navigate('/');
    }

    return (
        <header className="Header">
            <button className="Header-button" onClick={handleClick}><img className="logo" alt="Kinnie Playlist logo" src={logo2} /> character playlist database</button>
        </header>
    );
}

export default Header;