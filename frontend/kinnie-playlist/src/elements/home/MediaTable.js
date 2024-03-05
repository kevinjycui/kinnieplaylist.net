import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from "react-router-dom";
import { apiJson } from '../../api/apiUtil';
import { TokenContext } from '../../AuthRoute';

const MediaTable = ({ searchTerm, media, voteStatus, setMedia, }) => {
    const [token] = useContext(TokenContext);
    const [mediaList, setMediaList] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        async function getMediaList() {
            const mediaListData = await apiJson('/api/medias?access_token='
                + token
                + '&q=' + (searchParams.has("q") ? searchParams.get("q") : "")
                + '&fandom=' + (searchParams.has("fandom") ? searchParams.get("fandom") : "")
                + '&status=' + (searchParams.has("status") ? searchParams.get("status") : "")
            );
            if (mediaListData.status === 200) {
                setMediaList(mediaListData.response.medias);
            }
        }

        getMediaList();

    }, [token, searchParams]);

    function filterByMedia(e) {
        setMedia(e.target.value);
        searchParams.set("fandom", e.target.value);
        searchParams.sort();
        setSearchParams(searchParams);
    }

    return (
        <div className="MediaTable">
            {
                mediaList === null || mediaList.length === 0 ? <></>
                :
                <ul className="Filter-list" onChange={filterByMedia.bind(this)}>
                    {mediaList.map(mediaItem => 
                        <li key={mediaItem.media} className="Filter-radio">
                            <label>
                                <input 
                                    type="radio"
                                    name="media"
                                    value={mediaItem.media}
                                    checked={mediaItem.media === media}
                                    readOnly={true}
                                />
                                {mediaItem.media} ({mediaItem.number_of_voters})
                            </label>
                        </li>)
                    }
                </ul>
            }
        </div>
    );
};

export default MediaTable;