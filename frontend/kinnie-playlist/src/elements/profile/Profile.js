import React, { useState, useEffect, Suspense, lazy, useContext } from 'react';

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
        document.title = "Profile | Kinnie Playlist";

        async function getCharacters() {
            const charactersData = await apiJson('/api/characters/top?access_token=' + token);
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
            </div>
            <div className="buffer"></div>
        </>
    );
}

export default Profile;