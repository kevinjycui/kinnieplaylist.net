import React from 'react';
import { useNavigate } from "react-router-dom";

import logo2 from "../logo2.svg";

import "./Header.css"
import { apiJson } from '../api/apiUtil';

function Header() {
    const navigate = useNavigate();

    async function navigateToRandom() {
        const characterData = await apiJson("/api/character/random");
        if (characterData.status === 200) {
            navigate("/character/" + characterData.response.character_id);
        }
    }

    return (
        <header className="Header">
            <button className="Header-button" onClick={() => navigate("/")}><img className="logo" alt="Kinnie Playlist logo" src={logo2} /> character playlist database</button>
            <nav className="Header-nav-container">
                <button className="Header-nav" onClick={() => navigate("/latest")}>
                    latest
                </button>
                <button className="Header-nav" onClick={navigateToRandom}>
                    random
                </button>
                <a className="Header-nav" href="https://forms.gle/2RL1aLtntu9qhjo77" rel="noreferrer">
                    join waitlist
                </a>
            </nav>
        </header>
    );
}

export default Header;