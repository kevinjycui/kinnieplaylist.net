import React, { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router';

import Error from '../404'
import AddSong from './AddSong'
import Playlist from './Playlist';

import defaultImage from '../defaultImage.png'

import './Character.css'
import { apiJson } from '../api/apiUtil';

export const PlaylistContext = createContext([]);

function Character() {
    const { character } = useParams();
    const [data, setData] = useState([]);
    const [code, setCode] = useState();

    const [playlist, setPlaylist] = useState([]);

    useEffect(() => {

        async function getData() {
            const characterData = await apiJson('/api/characters/' + character);
            if (characterData.status === 200) {
                setData(characterData.response);
            }
            setCode(characterData.status);
        }

        getData();

        async function getPlaylist() {
            const playlistData = await apiJson('/api/playlist/global/' + character);
            if (playlistData.status === 200) {
                setPlaylist(playlistData.response.playlist.reverse().map((data) => {
                    data.song = JSON.parse(data.song);
                    return data;
                }));
            }
        }

        getPlaylist();

    }, [character]);

    return <>
        {
            code === 404 ? <Error /> : <>
                <PlaylistContext.Provider value={[playlist, setPlaylist]}>
                    <img className='Character-image' src={data.img_file} alt={data.name}
                        title={data.name + " from " + data.media}
                        onError={(image) => {
                            image.target.onerror = null;
                            image.target.src = defaultImage;
                        }}
                    />
                    <div className='Character-side'>
                        <div className='Character-name'>{data.name}</div>
                        <div className='Character-media'>{data.media}</div>
                        <AddSong />
                    </div>
                    <Playlist />
                    <div className="buffer"></div>
                </PlaylistContext.Provider>
            </>
        }
    </>
}

export default Character