import React, { useState, useEffect } from 'react';
import { apiJson } from '../../api/apiUtil';

const MediaTable = ({ characters, filteredCharacters, setFilteredCharacters, searchTerm, media, setMedia, resetLimit }) => {
    const [mediaList, setMediaList] = useState([]);

    useEffect(() => {
        async function getMediaList() {
            const mediaListData = await apiJson('/api/medias');
            if (mediaListData.status === 200) {
                setMediaList(mediaListData.response.medias);
            }
        }

        getMediaList();

        if (media !== '') {
            const filtered = characters.filter(character => {
                return (media === '' || character.media === media || character.media2 === media) && 
                    searchTerm.toUpperCase().split(" ").every((keyword) => (character.name + character.media).toUpperCase().includes(keyword));
            })
            setFilteredCharacters(filtered);
        }
    }, [media, searchTerm, setMediaList, characters, setFilteredCharacters]);

    function filterByMedia(e) {
        const mediaItem = e.target.value;
        setMedia(mediaItem);
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