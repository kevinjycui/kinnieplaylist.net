import React, { useContext } from 'react';
import { useSearchParams } from "react-router-dom";
import { apiJson } from '../../api/apiUtil';
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
        
        const searchTermUpper = searchTerm.toUpperCase();
        const filtered = characters.filter(character => {
            return (media === '' || character.media === media || character.media2 === media) && 
                searchTermUpper.split(" ").every((keyword) => (character.name + character.media).toUpperCase().includes(keyword));
        }).sort(
            (character1, character2) => {
                const directSearch1 = character1.name.toUpperCase().startsWith(searchTermUpper) || 
                                        character1.media.toUpperCase().startsWith(searchTermUpper);
                const directSearch2 = character2.name.toUpperCase().startsWith(searchTermUpper) || 
                                        character2.media.toUpperCase().startsWith(searchTermUpper);
                if (directSearch1 && !directSearch2) {
                    return -1;
                }
                else if (!directSearch1 && directSearch2) {
                    return 1;
                }
                return character1.name.replace("\"", "") > character2.name.replace("\"", "") ? 1:-1;
            }
        )
        setFilteredCharacters(filtered);
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