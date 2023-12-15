import React, { useState, useEffect, useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons'

import { PlayerContext, PremiumContext, RefreshTokenContext, TokenContext, TrackContext } from '../AuthRoute'

import default_image from "../default_image.png"

import "./WebPlayback.css"
import { spotifyApi } from '../api/apiUtil';

export const track = {
    song_id: "",
    title: "",
    img_file: "",
    artists: "",
    genres: "",
    explicit: false,
    duration: 0
}

function WebPlayback() {

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [error, setError] = useState(false);

    const [current_track, setTrack] = useContext(TrackContext)
    const [player, setPlayer] = useContext(PlayerContext)
    const [token, setToken] = useContext(TokenContext);
    const [is_premium, setPremium] = useContext(PremiumContext);

    const [refreshToken] = useContext(RefreshTokenContext);

    useEffect(() => {
        if (player != null) {
            if (!is_active) {
                player.connect();
            }
            return;
        }

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        async function switchDevice(device_id) {
            const response = await spotifyApi('me/player', token, setToken, refreshToken, 'PUT', JSON.stringify({
                "device_ids": [device_id],
                "play": true
            }))
            if (response.status !== 202) {
                console.error('Failed to auto transfer playback.');
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

                setPremium(true);
                switchDevice(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => {

                if (!state) {
                    return;
                }

                const data = state.track_window.current_track;

                if (data == null) {
                    return;
                }

                setTrack({
                    song_id: data.id,
                    title: data.name,
                    img_file: data.album.images[0].url,
                    artists: data.artists.map(artist => artist.name).join(", "),
                    genres: data.artists.map(artist => (artist.genres ?? []).join(", ")).filter((genres => genres.length > 0)).join(", "),
                    explicit: (data.explicit ?? false),
                    duration: (data.duration_ms ?? 0)
                });

                setPaused(state.paused);

                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                });

            }));

            player.addListener('autoplay_failed', () => {
                console.log('Autoplay is not allowed by the browser autoplay rules');
            });

            player.on('initialization_error', ({ message }) => {
                console.error('Failed to initialize:', message);
                setError(true);
            });

            player.on('authentication_error', ({ message }) => {
                console.error('Failed to authenticate:', message);
                setPremium(false);
                window.location.reload(false);
            });

            player.on('account_error', ({ message }) => {
                console.error('Failed to validate Spotify account:', message);
                setError(true);
            });

            player.activateElement();
            player.connect();

            window.addEventListener('beforeunload', () => player.disconnect());
        };

    }, [token, setToken, refreshToken, player, setPlayer, setTrack, is_active, setPremium]);

    return error ?
        <>
            <div className="container WebPlayback-player">
                <div className="main-wrapper">
                    <img className="now-playing__cover WebPlayback-cover" alt='' src={default_image} />
                    <div className="now-playing__side WebPlayback-side">
                        <div className="now-playing__name WebPlayback-title">
                            <i>Spotify Premium required to play and vote for tracks through the web player</i>
                        </div>
                    </div>
                    <div className="WebPlayback-spotify">
                        Remote control with <a href="spotify:" rel="noreferrer"><img className="WebPlayback-spotifyLogo" alt='Spotify logo' src='/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Green.png' /></a>
                    </div>
                </div>
            </div>
        </> : (
            current_track.song_id === undefined || current_track.song_id === '' ?
                <>
                    <div className="container WebPlayback-player">
                        <div className="main-wrapper">
                            <img className="now-playing__cover WebPlayback-cover" alt='' src={default_image} />
                            <div className="now-playing__side WebPlayback-side">
                                <div className="now-playing__name WebPlayback-title">
                                    <i>Connecting to Spotify on device "Kinnie Playlist Web Playback"...</i>
                                </div>
                            </div>
                            <div className="WebPlayback-spotify">
                                Remote control with <a href="spotify:" rel="noreferrer"><img className="WebPlayback-spotifyLogo" alt='Spotify logo' src='/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Green.png' /></a>
                            </div>
                        </div>
                    </div>
                </> :
                <>
                    <div className="container WebPlayback-player">
                        <div className="main-wrapper">
                            <a href={"spotify:track:" + current_track.song_id} rel="noreferrer">
                                <img src={current_track.img_file}
                                    className="now-playing__cover WebPlayback-cover"
                                    alt={current_track.title}
                                    onError={(image) => {
                                        image.target.onerror = null;
                                        image.target.src = default_image;
                                    }}
                                />
                            </a>

                            <div className="now-playing__side WebPlayback-side">
                                <div className="now-playing__name WebPlayback-title"
                                    title={"Now Playing: " + current_track.title}
                                >Now Playing: <b><a href={"spotify:track:" + current_track.song_id} rel="noreferrer">{
                                    current_track.title
                                }</a></b></div>
                                {/* <div className="now-playing__explicit">{current_track.explicit ? <FontAwesomeIcon icon={faE} /> : <></>}</div> */}
                                <div className="now-playing__artist WebPlayback-artists"
                                    title={current_track.artists}
                                >
                                    {
                                        current_track.artists
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
                                Remote control with <a href="spotify:" rel="noreferrer"><img className="WebPlayback-spotifyLogo" alt='Spotify logo' src='/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Green.png' /></a>
                            </div>
                        </div>
                    </div>
                </>
        );
}

export default WebPlayback