import React from 'react';
import { useSearchParams } from "react-router-dom";

const VoteStatusTable = ({ voteStatus, setVoteStatus }) => {

    const [searchParams, setSearchParams] = useSearchParams();

    function filterByVoted(e) {
        setVoteStatus(e.target.value);
        searchParams.set("status", e.target.value);
        searchParams.sort();
        setSearchParams(searchParams);
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