import React, { useState, useContext } from 'react';

import { PlaylistContext } from './Character';
import Song from './Song';

import './Playlist.css'

function Playlist() {
    const [playlist] = useContext(PlaylistContext)
    const [limit, setLimit] = useState(1);

    return <>
        {
            <div className="Playlist">
                {
                    [...Array(limit).keys()].map((range) =>
                        playlist.sort((data1, data2) => data2.number_of_users - data1.number_of_users)
                            .slice(range * 10, (range + 1) * 10).map(
                                (data, index) =>
                                    <Song
                                        key={data.song_id}
                                        index={range * 10 + index}
                                        song={data.song_id}
                                        number={data.number_of_users}
                                    />
                            )
                    )
                }
            </div>
        }
        <div className="Playlist-bottom-container">
            {limit * 10 < playlist.length ? <button className="Playlist-show-more"
                onClick={() => { setLimit(limit + 1) }}>Show more</button> : <></>
            }
        </div>
    </>
}

export default Playlist