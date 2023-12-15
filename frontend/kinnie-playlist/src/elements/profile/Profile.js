import React, { useState, useEffect, Suspense, lazy, useContext } from 'react';

import Header from '../Header';
import './Profile.css';
import { apiJson } from '../../api/apiUtil';
import { PremiumContext, TokenContext } from '../../AuthRoute';
import { useNavigate } from 'react-router-dom';

const CharacterButton = lazy(() => import('../CharacterButton'));

function Profile() {
    const navigate = useNavigate();

    const [myCharacters, setMyCharacters] = useState([]);
    const [token] = useContext(TokenContext);
    const [is_premium] = useContext(PremiumContext);

    useEffect(() => {
        async function getCharacters() {
            const charactersData = await apiJson('/api/characters/mine?access_token=' + token);
            if (charactersData.status === 200) {
                setMyCharacters(charactersData.response.characters.map((data) => JSON.parse(data)));
            }
        }

        getCharacters();

    }, [token]);

    return (
        <>
            <div className='Profile'>
                <div className='Profile-container'>
                    <h3>My Characters</h3>
                    {is_premium ? (myCharacters.length === 0 ? <div className="empty">Nobody here... Go and&nbsp;
                    <button className='Profile-button' onClick={() => navigate("/")}>vote</button>!</div> :
                        myCharacters.sort((a, b) => {
                            var nameA = a.name.toUpperCase();
                            var nameB = b.name.toUpperCase();
                            return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
                        }).map(character => (
                            <div className='Profile-characterModule' key={character.character_id}>
                                <Suspense fallback={<></>}>
                                    <CharacterButton
                                        data={character}
                                    />
                                </Suspense>
                            </div>
                        ))) : <div className="empty">Spotify Premium required to create a voting profile</div>}
                </div>
            </div>
            <div className="buffer"></div>
        </>
    );
}

export default Profile;