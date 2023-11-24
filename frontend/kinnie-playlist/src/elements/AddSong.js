import React, { useState, useContext } from 'react';
import { useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { apiJson } from '../api/apiUtil'
import { TokenContext, TrackContext } from '../AuthRoute'

import { track } from './WebPlayback';

import './AddSong.css'
import { PlaylistContext } from './Character';

function AddSong() {
    const { character } = useParams();

    const [token] = useContext(TokenContext);
    const [current_track] = useContext(TrackContext);

    const [loading, setLoading] = useState('');

    const [playlist, setPlaylist] = useContext(PlaylistContext);

    async function addCurrentSong() {
        if (loading !== '') {
            return;
        }

        setLoading('Casting your vote...');

        const added_id = current_track.song_id;

        const addSong = await apiJson('/api/playlist/mine/' + character, 'POST', JSON.stringify({
            "access_token": token,
            "song_id": added_id
        }))
        if (addSong.status !== 200) {
            return;
        }

        if (addSong.response.duplicate) {
            alert("You've already voted for this song on this character!");
            setLoading('');
            return;
        }

        var newPlaylist = [...playlist];

        for (var i = 0; i < newPlaylist.length; i++) {
            if (newPlaylist[i].song.song_id === added_id) {
                newPlaylist[i].number_of_users++;
                setPlaylist(newPlaylist);
                setLoading('');
                return;
            }
        }

        newPlaylist.unshift({
            song: JSON.parse(addSong.response.song),
            number_of_users: 1
        });
        setPlaylist(newPlaylist);
        setLoading('');
    }

    return (
        token != null && current_track != track ?
            <button className="AddSong" onClick={addCurrentSong} >
                <FontAwesomeIcon className="AddSong-icon" icon={faAngleUp} />
                <div className="Addsong-text">{
                    loading === '' ?
                        <>Vote <b>{current_track.title}</b> by {current_track.artists} for this character's theme!</> :
                        <>{loading}</>
                }</div>
            </button >
            : <></>
    );
}

export default AddSong;