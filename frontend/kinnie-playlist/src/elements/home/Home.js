import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from "react-router-dom";

import SearchBar from './SearchBar';
import MediaTable from './MediaTable';
import './Home.css';
import { apiJson } from '../../api/apiUtil';
import VoteStatusTable from './VoteStatusTable';

import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CharacterButton = lazy(() => import('../CharacterButton'));

const LIMIT_STEP = 36;

function Home() {

    const [characters, setCharacters] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [media, setMedia] = useState('');
    const [limit, setLimit] = useState(0);
    const [voteStatus, setVoteStatus] = useState('');

    const [showVoteFilter, toggleVoteFilter] = useState(true);
    const [showMediaFilter, toggleMediaFilter] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();

    function resetLimit() {
        setLimit(LIMIT_STEP);
    }

    async function getCharacters() {
        const charactersData = await apiJson('/api/characters');
        if (charactersData.status === 200) {
            setCharacters(charactersData.response.characters.map((data) => JSON.parse(data)));
        }
    }

    useEffect(() => {
        document.title = "Home | Kinnie Playlist";

        if (searchTerm !== "") {
            searchParams.set("q", searchTerm);
        }
        if (media !== "") {
            searchParams.set("fandom", media);
        }
        if (voteStatus !== "") {
            searchParams.set("status", voteStatus);
        }
        else {
            getCharacters();
        }
        searchParams.sort();
        setSearchParams(searchParams);
        
        resetLimit();

        setSearchTerm(searchTerm => searchParams.has("q") ? searchParams.get("q") : searchTerm);
        setMedia(media => searchParams.has("fandom") ? searchParams.get("fandom") : media);
        setVoteStatus(voteStatus => searchParams.has("status") ? searchParams.get("status") : voteStatus);

    }, [setCharacters, searchParams]);

    return (
        <>
            <>
                <div className='Home'>
                    <div className='Home-sidebar'>
                        <button className="Home-button" onClick={() => {
                            setSearchTerm('');
                            setMedia('');
                            if (voteStatus !== '') {
                                setVoteStatus('');
                                getCharacters();
                            }
                            resetLimit();

                            searchParams.delete("q");
                            searchParams.delete("fandom");
                            searchParams.delete("status");
                            setSearchParams(searchParams);
                        }}>Clear filter</button>
                        <SearchBar characters={characters} setFilteredCharacters={setFilteredCharacters}
                            media={media} searchTerm={searchTerm} setSearchTerm={setSearchTerm} resetLimit={resetLimit} />        
                        <button className="Home-collapsable-button" onClick={() => toggleVoteFilter(!showVoteFilter)}>{showVoteFilter ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretRight} />}&nbsp;My voting status</button>
                        {showVoteFilter ? <VoteStatusTable characters={characters} setCharacters={setCharacters} setFilteredCharacters={setFilteredCharacters} 
                            searchTerm={searchTerm} media={media} voteStatus={voteStatus} setVoteStatus={setVoteStatus} resetLimit={resetLimit} />:<></>}
                        <button className="Home-collapsable-button" onClick={() => toggleMediaFilter(!showMediaFilter)}>{showMediaFilter ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretRight} />}&nbsp;Fandom</button>
                        {showMediaFilter ? <MediaTable characters={characters} filteredCharacters={filteredCharacters} setFilteredCharacters={setFilteredCharacters}
                            searchTerm={searchTerm} media={media} setMedia={setMedia} resetLimit={resetLimit} />:<></>}
                    </div>
                    <div className='Home-container'>
                        {filteredCharacters.length === 0 ? <div className="empty">Nobody here... Try changing your search?</div> :
                        <>
                        <div className='Home-message'>Found {filteredCharacters.length} {filteredCharacters.length === 1 ? "character" : "characters"} {media === '' && searchTerm === '' && voteStatus === '' ? "(Sorted by most popular)":""}</div>
                        {filteredCharacters.slice(0, limit).map(character => (
                            <div className='Home-characterModule' key={character.character_id}>
                                <Suspense fallback={<></>}>
                                    <CharacterButton
                                        data={character}
                                    />
                                </Suspense>
                            </div>
                        ))}
                        </>
                        }
                        {filteredCharacters.length <= limit ? <></> : <button className='Home-show-more' onClick={() => setLimit(limit + LIMIT_STEP)}>Show more</button>}
                    </div>
                </div>
            </>
            <div className="buffer"></div>
        </>
    );
}

export default Home;