import React, { useContext } from 'react';

import { TokenContext } from './AuthRoute'

function AddSong(props) {
    const token = useContext(TokenContext);

    async function addCurrentSong() {
        const spotify_response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );
        const spotify_json = await spotify_response.json();
        var songId = spotify_json.item.id;

        console.log(spotify_json)

        const response = await fetch('/api/playlist/mine/' + props.characterId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "access_token": token,
                    "song_id": songId
                })
            }
        );
        const json = await response.json();

        if (json.duplicate)
        {
            alert("You've already added this song");
        }
    }

    return (
        <button onClick={addCurrentSong}>
            Add current song
        </button>
    );
}

export default AddSong;