import React, { useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { apiJson } from '../api/apiUtil'
import { TokenContext, TrackContext } from '../AuthRoute'

import './AddSong.css'

function AddSong({ character }) {
    const [token] = useContext(TokenContext);
    const [track] = useContext(TrackContext);

    async function addCurrentSong() {
        const addSong = await apiJson('/api/playlist/mine/' + character, 'POST', JSON.stringify({
            "access_token": token,
            "song_id": track.song_id
        }))
        if (addSong.status !== 200) {
            return;
        }

        if (addSong.response.duplicate) {
            alert("You've already voted for this song on this character!");
        }
    }

    return (
        token != null ?
            <button className="AddSong" onClick={addCurrentSong} >
                <FontAwesomeIcon className="AddSong-icon" icon={faAngleUp} />
                <div className="Addsong-text">Vote <b>{track.title}</b> by {track.artists} for this character's theme!</div>
            </button >
            : <></>
    );
}

export default AddSong;