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
            <button className="Header-button" onClick={handleClick}><img className="logo" src="kinnieplaylistlogo.svg"/></button>
        </header>
    );
}

export default Header;