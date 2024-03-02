import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import { useSearchParams } from "react-router-dom";

import SearchBar from './SearchBar';
import MediaTable from './MediaTable';
import './Home.css';
import { apiJson } from '../../api/apiUtil';
import VoteStatusTable from './VoteStatusTable';

import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TokenContext } from '../../AuthRoute';

const CharacterButton = lazy(() => import('../CharacterButton'));

const LIMIT = 72;

function Home() {
    const [token] = useContext(TokenContext);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [filteredCharacters, setCharacters] = useState([]);
    const [tempSearchTerm, setTempSearchTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [media, setMedia] = useState('');
    const [voteStatus, setVoteStatus] = useState('');

    const [showVoteFilter, toggleVoteFilter] = useState(true);
    const [showMediaFilter, toggleMediaFilter] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();

    function setCurrentPage(p) {
        setPage(p);
        searchParams.set("page", p);
        searchParams.sort();
        setSearchParams(searchParams);
    }

    function clearFilter() {
        setTempSearchTerm('');
        setSearchTerm('');
        setMedia('');
        if (voteStatus !== '') {
            setVoteStatus('');
        }
        setCurrentPage(1);

        searchParams.delete("q");
        searchParams.delete("fandom");
        searchParams.delete("status");
        setSearchParams(searchParams);
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
        
        searchParams.sort();
        setSearchParams(searchParams);

        async function getCharacters() {
            const charactersData = await apiJson('/api/characters?access_token=' 
                     + token
                     + '&q=' + searchTerm 
                     + '&fandom=' + media 
                     + '&status=' + voteStatus 
                     + '&limit='  + LIMIT 
                     + '&offset=' + ((page - 1) * LIMIT));
            if (charactersData.status === 200) {
                setCharacters(charactersData.response.characters.map((data) => JSON.parse(data)));
                setTotal(parseInt(charactersData.response.total_count));
            }
        }

        getCharacters();

        setPage(searchParams.has("page") ? parseInt(searchParams.get("page")) : 1);
        if (page < 1) {
            setCurrentPage(1);
        }

        setSearchTerm(searchTerm => searchParams.has("q") ? searchParams.get("q") : searchTerm);
        setMedia(media => searchParams.has("fandom") ? searchParams.get("fandom") : media);
        setVoteStatus(voteStatus => searchParams.has("status") ? searchParams.get("status") : voteStatus);

    }, [searchTerm, media, voteStatus, page]);

    return (
        <>
            <>
                <div className='Home'>
                    <div className='Home-sidebar'>
                        <button className="Home-button" onClick={clearFilter}>Clear filter</button>
                        <SearchBar tempSearchTerm={tempSearchTerm} setTempSearchTerm={setTempSearchTerm} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />        
                        <button className="Home-collapsable-button" onClick={() => toggleVoteFilter(!showVoteFilter)}>{showVoteFilter ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretRight} />}&nbsp;My voting status</button>
                        {showVoteFilter ? <VoteStatusTable voteStatus={voteStatus} setVoteStatus={setVoteStatus} />:<></>}
                        <button className="Home-collapsable-button" onClick={() => toggleMediaFilter(!showMediaFilter)}>{showMediaFilter ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretRight} />}&nbsp;Fandom</button>
                        {showMediaFilter ? <MediaTable searchTerm={searchTerm} media={media} voteStatus={voteStatus} setMedia={setMedia} />:<></>}
                    </div>
                    <div className='Home-container'>
                        {filteredCharacters.length === 0 ? <div className="empty">Nobody here... Try changing your search?</div> :
                        <>
                        <div className='Home-message'>Found {total} {total === 1 ? "character" : "characters"} {media === '' && searchTerm === '' && voteStatus === '' ? "(Sorted by most popular)":""}</div>
                        {filteredCharacters.map(character => (
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
                        {total <= LIMIT ? <></> :
                            <div className='show-more-container' >
                                {page <= 2 ? <></> : <button className='show-more' onClick={() => setCurrentPage(1)}>{"<<"}</button>}
                                {page <= 1 ? <></> : <button className='show-more' onClick={() => setCurrentPage(page-1)}>{"<"}</button>}
                                {page <= 2 ? <></> : <button className='show-more' onClick={() => setCurrentPage(page-2)}>{page-2}</button>}
                                {page <= 1 ? <></> : <button className='show-more' onClick={() => setCurrentPage(page-1)}>{page-1}</button>}
                                <button className='show-more-disabled'>{page}</button>
                                {page*LIMIT >= total ? <></> : <button className='show-more' onClick={() => setCurrentPage(page + 1)}>{page+1}</button>}
                                {(page+1)*LIMIT >= total ? <></> : <button className='show-more' onClick={() => setCurrentPage(page + 2)}>{page+2}</button>}
                                {page*LIMIT >= total ? <></> : <button className='show-more' onClick={() => setCurrentPage(page + 1)}>{">"}</button>}
                                {(page+1)*LIMIT >= total ? <></> : <button className='show-more' onClick={() => setCurrentPage(Math.floor(total/LIMIT) + 1)}>{">>"}</button>}
                            </div>}
                    </div>
                </div>
            </>
            <div className="buffer"></div>
        </>
    );
}

export default Home;