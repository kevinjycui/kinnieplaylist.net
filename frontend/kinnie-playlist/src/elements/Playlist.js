import React, { useContext } from 'react';

import Song from './Song';
import { PlaylistContext } from './Character';

import './Playlist.css'

function Playlist() {
    const [playlist] = useContext(PlaylistContext)

    return <>
        {
            <div className="Playlist">
                {
                    playlist.sort((data1, data2) => data1.number_of_users - data2.number_of_users).map(
                        (data, index) => <Song
                            key={data.song.song_id}
                            index={index}
                            data={data.song}
                            number={data.number_of_users}
                        />
                    )
                }
            </div>
        }
    </>
}

export default Playlist