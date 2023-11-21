import React, { useContext } from 'react';

import { spotifyApiJson, apiJson } from '../api/apiUtil'
import { RefreshTokenContext, TokenContext } from '../AuthRoute'

function AddSong({ character }) {
    const [token, setToken] = useContext(TokenContext);
    const refreshToken = useContext(RefreshTokenContext);

    async function addCurrentSong() {
        const currentlyPlaying = await spotifyApiJson('me/player/currently-playing', token, setToken, refreshToken);
        if (currentlyPlaying.status != 200) {
            return;
        }
        var songId = currentlyPlaying.response.item.id;

        const addSong = await apiJson('/api/playlist/mine/' + character, 'POST', JSON.stringify({
            "access_token": token,
            "song_id": songId
        }))
        if (addSong.status != 200) {
            return;
        }

        if (addSong.response.duplicate) {
            alert("You've already added this song");
        }
    }

    return (
        <button onClick={addCurrentSong}>
            Add current song!
        </button>
    );
}

export default AddSong;