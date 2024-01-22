import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { apiJson } from '../../api/apiUtil';
import { filterCharacters } from './filterUtil';

const MediaTable = ({ characters, filteredCharacters, setFilteredCharacters, searchTerm, media, setMedia, resetLimit }) => {
    const [mediaList, setMediaList] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        async function getMediaList() {
            const mediaListData = await apiJson('/api/medias');
            if (mediaListData.status === 200) {
                setMediaList(mediaListData.response.medias);
            }
        }

        getMediaList();

        if (media !== '' || searchTerm !== '') {
            setFilteredCharacters(filterCharacters(characters, searchTerm, media));
        }
        else {
            setFilteredCharacters(characters);
        }
    }, [media, searchTerm, setMediaList, characters, setFilteredCharacters]);

    function filterByMedia(e) {
        const mediaItem = e.target.value;
        setMedia(mediaItem);
        searchParams.set("fandom", mediaItem);
        searchParams.sort();
        setSearchParams(searchParams);
        resetLimit();
    }

    return (
        <div className="MediaTable">
            {
                mediaList === null || mediaList.length === 0 ? <></>
                :
                <ul className="Filter-list" onChange={filterByMedia.bind(this)}>
                    {mediaList.filter(mediaItem => 
                        filteredCharacters.map(character => character.media).includes(mediaItem) ||
                        filteredCharacters.map(character => character.media2).includes(mediaItem)).map(mediaItem => 
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