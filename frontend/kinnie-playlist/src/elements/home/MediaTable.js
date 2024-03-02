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
                + '&q=' + searchTerm
                + '&fandom=' + media
                + '&status=' + voteStatus
            );
            if (mediaListData.status === 200) {
                setMediaList(mediaListData.response.medias);
            }
        }

        getMediaList();

    }, [token, searchTerm, media, voteStatus, setMediaList]);

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
                        <li key={mediaItem} className="Filter-radio">
                            <label>
                                <input 
                                    type="radio"
                                    name="media"
                                    value={mediaItem}
                                    checked={mediaItem === media}
                                    readOnly={true}
                                />
                                {mediaItem}
                            </label>
                        </li>)
                    }
                </ul>
            }
        </div>
    );
};

export default MediaTable;