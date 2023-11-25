import React, { useState, useEffect, createContext, Suspense } from 'react';
import { useParams } from 'react-router';

import Header from './Header';
import Error from '../404';
import AddSong from './AddSong';
import Playlist from './Playlist';

import default_image from '../default_image.png'

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
                setPlaylist(playlistData.response.playlist.reverse());
            }
        }

        getPlaylist();

    }, [character]);

    return <>
        {
            code === 404 ? <Error /> : <>
                <PlaylistContext.Provider value={[playlist, setPlaylist]}>
                    <Header position="fixed" />
                    <div className='Character-info'>
                        <Suspense fallback={<img className='Character-image' src={default_image} alt="Loading" />}>
                            <img className='Character-image' src={data.img_file} alt={data.name}
                                title={data.name + " from " + data.media}
                                onError={(image) => {
                                    image.target.onerror = null;
                                    image.target.src = default_image;
                                }}
                            />
                        </Suspense>
                        <div className='Character-side'>
                            <div className='Character-name'>{data.name}</div>
                            <div className='Character-media'>{data.media}</div>
                        </div>
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