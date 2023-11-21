import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import Song from './Song';

import './Playlist.css'
import { apiJson } from '../api/apiUtil';

function Playlist() {
    const { character } = useParams();
    const [playlist, setPlaylist] = useState([]);

    useEffect(() => {
        async function getPlaylist() {
            const playlistData = await apiJson('/api/playlist/global/' + character);
            if (playlistData.status === 200) {
                setPlaylist(playlistData.response.playlist.reverse().map((data) => {
                    data.song = JSON.parse(data.song);
                    return data;
                }));
            }
        }

        getPlaylist();

    }, []);

    return <>
        {
            <div className="Playlist">
                {
                    playlist.sort((data1, data2) => data1.number_of_users - data2.number_of_users).map(
                        (data, index) => <Song
                            key={data.song.song_id}
                            index={index}
                            data={data.song}
                        />
                    )
                }
            </div>
        }
    </>
}

export default Playlist