import React, { useState, useEffect, useContext } from 'react';

import { TokenContext } from './AuthRoute'

import "./WebPlayback.css"

const track = {
    name: "Play a track from Spotify",
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
    const [current_track, setTrack] = useState(track);
    const [player, setPlayer] = useState(undefined);
    const token = useContext(TokenContext);

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
    
            const player = new window.Spotify.Player({
                name: 'Kinnie Playlist Web Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });
    
            setPlayer(player);
    
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });
    
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }
            
                setTrack(state.track_window.current_track);
                setPaused(state.paused);
            
            
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
            
            }));
    
            player.connect();

            window.onbeforeunload = player.disconnect();
    
        };
    }, []);

    return (
        <>
            <div id={current_track.id} className="container WebPlayback-player">
                <div className="main-wrapper">
                    <img src={current_track.album.images[0].url} 
                        className="now-playing__cover WebPlayback-cover" 
                        onError={(image) => {
                            image.target.onerror = null;
                            image.target.src='default.png';
                        }}
                        alt="" />

                    <div className="now-playing__side WebPlayback-side">
                        <div className="now-playing__name WebPlayback-title">{
                                    current_track.name
                                    }</div>

                        <div className="now-playing__artist WebPlayback-artists">{
                                    current_track.artists.map(artist => artist.name).join(', ')
                                    }</div>

                        <button className="btn-spotify WebPlayback-button" onClick={() => { player.previousTrack() }} >

                        ⏴
                        </button>

                        <button className="btn-spotify WebPlayback-button" onClick={() => { player.togglePlay() }} >
                            { is_paused ? "⏯" : "⏸" }
                        </button>

                        <button className="btn-spotify WebPlayback-button" onClick={() => { player.nextTrack() }} >
                            ⏵
                        </button>
                    </div>
                </div>
            </div>
        </>
        );
}

export default WebPlayback