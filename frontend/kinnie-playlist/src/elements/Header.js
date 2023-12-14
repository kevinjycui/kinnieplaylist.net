import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";

import logo2 from "../logo2.svg";

import "./Header.css"
import { apiJson } from '../api/apiUtil';
import { RefreshTokenContext, TokenContext } from '../AuthRoute';

function Header() {
    const navigate = useNavigate();

    const [token, setToken] = useContext(TokenContext);
    const [refreshToken, setRefreshToken] = useContext(RefreshTokenContext);

    async function navigateToRandom() {
        if (token == '') {
            return;
        }
        const characterData = await apiJson("/api/character/random");
        if (characterData.status === 200) {
            navigate("/character/" + characterData.response.character_id);
        }
    }

    function logout() {
        setToken('');
        setRefreshToken('');
        localStorage.removeItem('kinnie-access-token');
        localStorage.removeItem('kinnie-refresh-token');
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