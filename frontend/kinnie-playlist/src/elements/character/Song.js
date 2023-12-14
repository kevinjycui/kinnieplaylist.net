import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { track } from '../WebPlayback'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

import { apiJson, spotifyApi } from '../../api/apiUtil';

import "./Song.css"
import { MyPlaylistContext, PlaylistContext } from './Character';
import { RefreshTokenContext, TokenContext, PremiumContext } from '../../AuthRoute';

function Song({ index, song, number, voted, indexed }) {
    const { character } = useParams();

    const [song_track, setTrack] = useState(track);

    const [token, setToken] = useContext(TokenContext);
    const [refreshToken] = useContext(RefreshTokenContext);
    const [playlist, setPlaylist] = useContext(PlaylistContext);
    const [setMyPlaylist] = useContext(MyPlaylistContext);
    const [is_premium] = useContext(PremiumContext);

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

    async function playTrack() {
        if (is_premium) {
            await spotifyApi('me/player/play', token, setToken, refreshToken, 'PUT', JSON.stringify({
                uris: ["spotify:track:" + song]
            }))
        }
    }

    useEffect(() => {
        async function getData() {
            const songData = await apiJson('/api/song/' + song);
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
                <button className="Song-button" onClick={playTrack} title="Play">
                    <img className="Song-cover" src={song_track.img_file} />
                </button>
                <div className="Song-side">
                    <button className="Song-button Song-title" onClick={playTrack} title="Play">
                        {song_track.title}
                    </button>
                    <div className="Song-artist">{song_track.artists}</div>
                    <a className="spotify-attrib" href={"spotify:track:" + song} rel="noreferrer">
                        <img className="spotify-icon" src="/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_Black.png"></img>
                        Play on Spotify
                        <FontAwesomeIcon className="external-icon" icon={faUpRightFromSquare} />
                    </a>
                </div>
            </div>
        </div >
    );
}

export default Song