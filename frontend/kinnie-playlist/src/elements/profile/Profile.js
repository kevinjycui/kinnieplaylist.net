import React, { useState, useEffect, Suspense, lazy, useContext } from 'react';

import './Profile.css';

import Vote from '../Vote';

import { apiJson } from '../../api/apiUtil';
import { TokenContext } from '../../AuthRoute';
import { useNavigate } from 'react-router-dom';

const CharacterButton = lazy(() => import('../CharacterButton'));

const LIMIT = 5;

function Profile() {
    const navigate = useNavigate();

    const [myCharacters, setMyCharacters] = useState([]);
    const [history, setHistory] = useState([]);
    const [historyPage, setHistoryPage] = useState(1);

    const [token] = useContext(TokenContext);

    useEffect(() => {
        document.title = "Profile | Kinnie Playlist";

        async function getCharacters() {
            const charactersData = await apiJson('/api/characters/top?access_token=' + token);
            if (charactersData.status === 200) {
                setMyCharacters(charactersData.response.characters.map((data) => JSON.parse(data)));
            }
        }

        getCharacters();

        async function getHistory() {
            const data = await apiJson('/api/votes/mine?access_token='
                + token 
                + '&limit=' + LIMIT
                + '&offset=' + (historyPage-1) * LIMIT
            );
            if (data.status === 200) {
                setHistory(data.response.votes.map((data) => JSON.parse(data)));
            }
        }

        getHistory();

    }, [token, historyPage]);

    return (
        <>
            <div className='Profile'>
                <div className='Profile-container'>
                    <h3>My Top Characters</h3>
                    {(myCharacters.length === 0 ? <div className="empty">Nobody here... Go and&nbsp;
                    <button className='Profile-button' onClick={() => navigate("/")}>vote</button>!</div> :
                        myCharacters.map(character => (
                            <div className='Profile-characterModule' key={character.character_id}>
                                <Suspense fallback={<></>}>
                                    <CharacterButton
                                        data={character}
                                    />
                                </Suspense>
                            </div>
                        )))}
                </div>
                <div className="Profile-container">
                    <h3>History</h3>
                    {history.length > 0 ? history.map((vote, index) =>
                        <Vote key={index} data={vote} user={"You"} />
                    ) : <></>}
                    <div className='show-more-container-left'>
                        {historyPage <= 1 ? <></> : <button className='show-more' onClick={() => setHistoryPage(1)}>{"Latest"}</button>}
                        {historyPage <= 1 ? <></> : <button className='show-more' onClick={() => setHistoryPage(historyPage-1)}>{"< Later"}</button>}
                        {history.length === 0 ? <></> : <button className='show-more' onClick={() => setHistoryPage(historyPage+1)}>{"Earlier >"}</button>}
                    </div>
                </div>
            </div>
            <div className="buffer"></div>
        </>
    );
}

export default Profile;