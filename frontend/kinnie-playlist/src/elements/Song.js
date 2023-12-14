import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { track } from './WebPlayback'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

import { apiJson } from '../api/apiUtil';

import "./Song.css"
import { MyPlaylistContext, PlaylistContext } from './Character';
import { TokenContext } from '../AuthRoute';

function Song({ index, song, number, voted, indexed }) {
    const { character } = useParams();

    const [song_track, setTrack] = useState(track);

    const [token] = useContext(TokenContext);
    const [playlist, setPlaylist] = useContext(PlaylistContext);
    const [setMyPlaylist] = useContext(MyPlaylistContext);

    async function castVote(added_id) {
        var newPlaylist = [...playlist];
        const bakPlaylist = JSON.stringify(playlist);

        for (var i = 0; i < newPlaylist.length; i++) {
            if (newPlaylist[i].song_id === added_id) {
                newPlaylist[i].number_of_users++;
                setPlaylist(newPlaylist);
                break;
            }
        }

        const addSong = await apiJson('/api/playlist/mine/' + character + '?access_token=' + token, 'POST',
            JSON.stringify({
                "song_id": added_id
            }))
        if (addSong.status !== 200) {
            alert("Failed to cast vote. Voting is disabled until Spotify approves this app. That's just how it is I guess.");
            setPlaylist(JSON.parse(bakPlaylist));
            return;
        }

        if (addSong.response.duplicate) {
            alert("You've already voted for this song on this character!");
            setPlaylist(JSON.parse(bakPlaylist));
            return;
        }

        setMyPlaylist(myPlaylist => new Set(myPlaylist.add(addSong.response.song_id)));
    }

    useEffect(() => {
        async function getData() {
            const songData = await apiJson('/api/songs/' + song);
            if (songData.status === 200) {
                setTrack(songData.response);
            }
        }

        getData();

    }, [song]);

    return (
        <div className="Song" id={song}>
            <div className="Song-info">
                {
                    voted ? <FontAwesomeIcon className="Song-vote-voted" icon={faAngleUp} /> :
                        <button className="Song-vote" onClick={() => castVote(song)}>
                            <FontAwesomeIcon className="Song-vote" icon={faAngleUp} />
                        </button>
                }
                {indexed ?
                    <>
                        <div className="Song-index">{index + 1}</div>
                        <div className="Song-number">{number + (number === 1 ? ' vote' : ' votes')}</div>
                    </>
                    : <></>
                }
            </div>

            <div className="Song-track-container">
                <a href={"https://open.spotify.com/track/" + song} target="_blank" rel="noreferrer">
                    <img className="Song-cover" src={song_track.img_file} />
                </a>
                <div className="Song-side">
                    <a className="Song-title" href={"https://open.spotify.com/track/" + song} target="_blank" rel="noreferrer">
                        {song_track.title}
                    </a>
                    <div className="Song-artist">{song_track.artists}</div>
                    <a className="spotify-attrib" href={"https://open.spotify.com/track/" + song} target="_blank" rel="noreferrer">
                        <img className="spotify-icon" src="/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_Green.png"></img>
                        Play on Spotify
                        <FontAwesomeIcon className="external-icon" icon={faUpRightFromSquare} />
                    </a>
                </div>
            </div>
        </div >
    );
}

export default Song