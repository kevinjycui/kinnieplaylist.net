import React, { useContext } from 'react';
import { useSearchParams } from "react-router-dom";
import { apiJson } from '../../api/apiUtil';
import { filterCharacters } from './filterUtil';
import { TokenContext } from '../../AuthRoute';

const VoteStatusTable = ({ characters, setCharacters, setFilteredCharacters, searchTerm, media, voteStatus, setVoteStatus, resetLimit }) => {

    const [token] = useContext(TokenContext);

    const [searchParams, setSearchParams] = useSearchParams();

    async function getVotedCharacters() {
        const charactersData = await apiJson('/api/characters/voted?access_token=' + token);
        if (charactersData.status === 200) {
            setCharacters(charactersData.response.characters.map((data) => JSON.parse(data)));
        }
    }

    async function getUnvotedCharacters() {
        const charactersData = await apiJson('/api/characters/unvoted?access_token=' + token);
        if (charactersData.status === 200) {
            setCharacters(charactersData.response.characters.map((data) => JSON.parse(data)));
        }
    }

    function filterByVoted(e) {
        if (e.target.value === "voted") {
            getVotedCharacters();
        }
        else if (e.target.value === "not voted") {
            getUnvotedCharacters();
        }
        setVoteStatus(e.target.value);
        searchParams.set("status", e.target.value);
        searchParams.sort();
        setSearchParams(searchParams);
        setFilteredCharacters(filterCharacters(characters, searchTerm, media));
        resetLimit();
    }

    return (
        <ul className="Filter-list" onChange={filterByVoted.bind(this)}>
        {voteStatus !== "not voted" ? <li className="Filter-radio">
            <label>
                <input 
                    type="radio"
                    name="vote-status"
                    value="voted"
                    checked={voteStatus === "voted"}
                    readOnly={true}
                />
                Voted
            </label>
        </li> : <></>}
        {voteStatus !== "voted" ? <li className="Filter-radio">
            <label>
                <input 
                    type="radio"
                    name="vote-status"
                    value="not voted"
                    checked={voteStatus === "not voted"}
                    readOnly={true}
                />
                Not voted
            </label>
        </li> : <></>}
    </ul>
    )

};

export default VoteStatusTable;