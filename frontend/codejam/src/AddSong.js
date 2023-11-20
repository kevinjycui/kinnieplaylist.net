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
        if (spotify_response.status != 200)
        {
            console.log(spotify_json.message);
        }
        var songId = spotify_json.item.id;

        const response = await fetch('/api/playlist/mine/' + props.character, {
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
        if (response.status != 200)
        {
            console.log(json.message);
        }

        if (json.duplicate)
        {
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