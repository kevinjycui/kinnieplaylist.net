import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'

import { apiJson } from '../api/apiUtil';

import "./Song.css"
import { MyPlaylistContext, PlaylistContext } from './Character';
import { TokenContext } from '../AuthRoute';

function Song({ index, song, number, voted, indexed }) {
    const { character } = useParams();

    const [token] = useContext(TokenContext);
    const [playlist, setPlaylist] = useContext(PlaylistContext);
    const [myPlaylist, setMyPlaylist] = useContext(MyPlaylistContext);

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

            <iframe className={index === 0 ? "" : "Song-small-embed"} title="Play on Spotify" src={"https://open.spotify.com/embed/track/" + song + "?utm_source=generator&theme=0"} width="100%" height={index === 0 ? "252" : "152"} frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div >
    );
}

export default Song