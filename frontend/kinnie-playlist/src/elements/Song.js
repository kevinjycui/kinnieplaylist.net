import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'

import { apiJson } from '../api/apiUtil';

import "./Song.css"
import { PlaylistContext } from './Character';
import { TokenContext } from '../AuthRoute';

function Song({ index, data, number }) {
    const { character } = useParams();

    const [token] = useContext(TokenContext);
    const [playlist, setPlaylist] = useContext(PlaylistContext);

    async function castVote(added_id) {
        var newPlaylist = [...playlist];
        var bakPlaylist = [...playlist];

        for (var i = 0; i < newPlaylist.length; i++) {
            if (newPlaylist[i].song.song_id === added_id) {
                newPlaylist[i].number_of_users++;
                setPlaylist(newPlaylist);
                break;
            }
        }

        const addSong = await apiJson('/api/playlist/mine/' + character, 'POST', JSON.stringify({
            "access_token": token,
            "song_id": added_id
        }))
        if (addSong.status !== 200) {
            return;
        }

        if (addSong.response.duplicate) {
            alert("You've already voted for this song on this character!");
            setPlaylist(bakPlaylist);
            return;
        }
    }

    return (
        <div className="Song" id={data.song_id}>
            <div className="Song-info">
                <button className="Song-vote" onClick={() => castVote(data.song_id)}>
                    <FontAwesomeIcon className="Song-vote" icon={faAngleUp} />
                </button>
                <div className="Song-index">{index + 1}</div>
                <div className="Song-number">{number + (number === 1 ? ' vote' : ' votes')}</div>
            </div>

            <iframe title="Play on Spotify" src={"https://open.spotify.com/embed/track/" + data.song_id + "?utm_source=generator&theme=0"} width="100%" height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    );
}

export default Song