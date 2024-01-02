import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { track } from '../WebPlayback'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faUpRightFromSquare, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

import { apiJson, spotifyApi } from '../../api/apiUtil';

import "./Song.css"
import { MyPlaylistContext, PlaylistContext } from './Character';
import { RefreshTokenContext, TokenContext, PremiumContext } from '../../AuthRoute';

function Song({ index, song, number, indexed }) {
    const { character } = useParams();

    const [song_track, setTrack] = useState(track);

    const [token, setToken] = useContext(TokenContext);
    const [refreshToken] = useContext(RefreshTokenContext);
    const [playlist, setPlaylist] = useContext(PlaylistContext);
    const [myPlaylist, setMyPlaylist] = useContext(MyPlaylistContext);
    const [is_premium] = useContext(PremiumContext);

    async function castVote() {
        var newPlaylist = [...playlist];
        const bakPlaylist = JSON.stringify(playlist);
        const bakMyPlaylist = new Set(myPlaylist);

        var songFound = false;

        for (var i = 0; i < newPlaylist.length; i++) {
            if (newPlaylist[i].song_id === song) {
                newPlaylist[i].number_of_users++;
                setPlaylist(newPlaylist);
                songFound = true;
                break;
            }
        }

        if (!songFound) {
            return;
        }

        setPlaylist(newPlaylist);

        setMyPlaylist(myPlaylist => new Set(myPlaylist.add(song)));

        const addSong = await apiJson('/api/playlist/mine/' + character + '?access_token=' + token, 'POST',
            JSON.stringify({
                "song_id": song
            }))
        if (addSong.status !== 200) {
            alert("Failed to cast vote. Voting is disabled until Spotify approves this app. That's just how it is I guess.");
            setPlaylist(JSON.parse(bakPlaylist));
            setMyPlaylist(bakMyPlaylist);
            return;
        }

        if (addSong.response.duplicate) {
            alert("You've already voted for this song on this character!");
            setPlaylist(JSON.parse(bakPlaylist));
            setMyPlaylist(bakMyPlaylist);
            return;
        }
    }

    async function uncastVote() {
        if (!myPlaylist.has(song)) {
            return;
        }

        var newPlaylist = [...playlist];
        const bakPlaylist = JSON.stringify(playlist);
        const bakMyPlaylist = new Set(myPlaylist);

        var songFound = false;

        for (var i = 0; i < newPlaylist.length; i++) {
            if (newPlaylist[i].song_id === song) {
                newPlaylist[i].number_of_users--;
                if (newPlaylist[i].number_of_users === 0) {
                    newPlaylist.splice(i, 1);
                }
                setPlaylist(newPlaylist);
                songFound = true;
                break;
            }
        }

        if (!songFound) {
            return;
        }

        setMyPlaylist(myPlaylist => {
            myPlaylist.delete(song);
            return new Set(myPlaylist);
        });

        const removeSong = await apiJson('/api/playlist/mine/' + character + '?access_token=' + token, 'DELETE',
            JSON.stringify({
                "song_id": song
            }))
        if (removeSong.status !== 200) {
            alert("Failed to remove vote. Voting is disabled until Spotify approves this app. That's just how it is I guess.");
            setPlaylist(JSON.parse(bakPlaylist));
            setMyPlaylist(bakMyPlaylist);
            return;
        }

        if (!removeSong.response.existed) {
            setPlaylist(JSON.parse(bakPlaylist));
            setMyPlaylist(bakMyPlaylist);
            return;
        }
    }

    async function playTrack() {
        if (is_premium) {
            await spotifyApi('me/player/play', token, setToken, refreshToken, 'PUT', JSON.stringify({
                uris: ["spotify:track:" + song]
            }))
        }
        else {
            alert("Spotify Premium required to play tracks on-demand");
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
                    myPlaylist.has(song) ? 
                        <button className="Song-vote-voted" onClick={uncastVote} title={"Remove vote for " + song_track.title + " by " + song_track.artists}>
                            <FontAwesomeIcon icon={faAngleUp} />
                        </button> :
                        <button className="Song-vote" onClick={castVote} title={"Vote " + song_track.title + " by " + song_track.artists}>
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
                    <img className="Song-cover" alt={song_track.title} src={song_track.img_file} />
                </button>
                <div className="Song-side">
                    <button className="Song-button Song-title" onClick={playTrack} title="Play">
                        {song_track.title}
                    </button>
                    <div className="Song-explicit">{song_track.explicit ? <>&nbsp;<a className="Song-explicit" href="https://support.spotify.com/us/article/explicit-content/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faTriangleExclamation} title="Explicit content"/></a></>:<></>}</div>
                    <div className="Song-artist">{song_track.artists}</div>
                    <a className="spotify-attrib" href={"spotify:track:" + song} rel="noreferrer">
                        <img alt="Spotify" className="spotify-icon" src="/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_Black.png"></img>
                        Play on Spotify
                        <FontAwesomeIcon className="external-icon" icon={faUpRightFromSquare} />
                    </a>
                </div>
            </div>
        </div >
    );
}

export default Song