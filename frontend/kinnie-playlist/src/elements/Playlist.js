import React, { useState, useContext } from 'react';

import { MyPlaylistContext, PlaylistContext } from './Character';
import Song from './Song';

import './Playlist.css'

const LIMIT_STEP = 10;

function Playlist() {
    const [playlist] = useContext(PlaylistContext);
    const [myPlaylist] = useContext(MyPlaylistContext);
    const [limit, setLimit] = useState(1);
    const [toggleMine, setToggleMine] = useState(false);

    return <>
        {
            <div className="Playlist">
                <div className="Playlist-options">
                    <button className="Playlist-option-button" onClick={() => setToggleMine(false)} disabled={!toggleMine}>Top Global Tracks</button>
                    <button className="Playlist-option-button" onClick={() => setToggleMine(true)} disabled={toggleMine}>My Tracks ({myPlaylist.size})</button>
                </div>
                {toggleMine ?
                    <>
                        <div className='Playlist-stat'>{myPlaylist.size} {myPlaylist.size === 1 ? "track" : "tracks"}</div>
                        {
                            [...Array(limit).keys()].map((range) =>
                                [...myPlaylist].reverse()
                                    .slice(range * LIMIT_STEP, (range + 1) * LIMIT_STEP).map(
                                        (song_id, index) =>
                                            <Song
                                                key={song_id}
                                                index={range * LIMIT_STEP + index}
                                                song={song_id}
                                                number={0}
                                                voted={true}
                                                indexed={false}
                                            />
                                    )
                            )
                        }
                    </> :
                    <>
                        <div className='Playlist-stat'>{playlist.length} {playlist.length === 1 ? "track" : "tracks"}</div>
                        {
                            [...Array(limit).keys()].map((range) =>
                                playlist.sort((data1, data2) => data2.number_of_users - data1.number_of_users)
                                    .slice(range * LIMIT_STEP, (range + 1) * LIMIT_STEP).map(
                                        (data, index) =>
                                            <Song
                                                key={data.song_id}
                                                index={range * LIMIT_STEP + index}
                                                song={data.song_id}
                                                number={data.number_of_users}
                                                voted={myPlaylist.has(data.song_id)}
                                                indexed={true}
                                            />
                                    )
                            )
                        }
                    </>}
            </div>
        }
        <div className="Playlist-bottom-container">
            {limit * 10 < (toggleMine ? myPlaylist.size : playlist.length) ? <button className="Playlist-show-more"
                onClick={() => { setLimit(limit + 1) }}>Show more</button> : <></>
            }
        </div>
    </>
}

export default Playlist