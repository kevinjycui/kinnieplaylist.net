import React, { useState, useEffect, useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons'

import { PlayerContext, RefreshTokenContext, TokenContext, TrackContext } from '../AuthRoute'

import "./WebPlayback.css"
import { spotifyApi } from '../api/apiUtil';

const track = {
    name: "Connect to Spotify and play on device \"Kinnie Playlist Web Playback\"",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ],
    id: ""
}

function WebPlayback() {

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useContext(TrackContext)
    const [player, setPlayer] = useContext(PlayerContext)
    const [token, setToken] = useContext(TokenContext);
    const refreshToken = useContext(RefreshTokenContext);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        async function switchDevice(device_id) {
            const response = await spotifyApi('me/player', token, setToken, refreshToken, 'PUT', JSON.stringify({
                "device_ids": [device_id],
                "play": true
            }))
            if (response.status != 200) {
                console.log('Failed to auto transfer playback.');
            }
        }

        async function loopOff(device_id) {
            const response = await spotifyApi('me/player/repeat?state=off', token, setToken, refreshToken, 'PUT', JSON.stringify({
                "device_ids": [device_id]
            }))
            if (response.status != 200) {
                console.log('Failed to turn off loop.');
            }
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Kinnie Playlist Web Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);

                switchDevice(device_id);
                loopOff(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                });

            }));

            player.connect();

            window.onunload = player.disconnect();
        };

    }, []);

    return (
        <>
            <div id={(current_track ?? track).id} className="container WebPlayback-player">
                <div className="main-wrapper">
                    <img src={(current_track ?? track).album.images[0].url}
                        className="now-playing__cover WebPlayback-cover"
                        alt={(current_track ?? track).name}
                        onError={(image) => {
                            image.target.onerror = null;
                            image.target.src = '/default.png';
                        }}
                    />

                    <div className="now-playing__side WebPlayback-side">
                        <div className="now-playing__name WebPlayback-title"
                            title={"Now Playing: " + (current_track ?? track).name}
                        >Now Playing: <b>{
                            (current_track ?? track).name
                        }</b></div>

                        <div className="now-playing__artist WebPlayback-artists"
                            title={(current_track ?? track).artists.map(artist => artist.name).join(', ')}
                        >{
                                (current_track ?? track).artists.map(artist => artist.name).join(', ')
                            }</div>
                        <div className="WebPlayback-controls">
                            <button className="btn-spotify WebPlayback-button" onClick={() => { player.previousTrack() }} >
                                <FontAwesomeIcon className="WebPlayback-button-icon" icon={faBackwardStep} />
                            </button>

                            <button className="btn-spotify WebPlayback-button" onClick={() => { player.togglePlay() }} >
                                <FontAwesomeIcon className="WebPlayback-button-icon" icon={is_paused ? faPlay : faPause} />
                            </button>

                            <button className="btn-spotify WebPlayback-button" onClick={() => { player.nextTrack() }} >
                                <FontAwesomeIcon className="WebPlayback-button-icon" icon={faForwardStep} />
                            </button>
                        </div>
                    </div>
                    <div className="WebPlayback-spotify">
                        Powered by <img className="WebPlayback-spotifyLogo" alt='Spotify logo' src='/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Green.png' />
                    </div>
                </div>
            </div>
        </>
    );
}

export default WebPlayback