import React, { useState, useEffect, useContext, createContext, Suspense } from 'react';
import { useParams } from 'react-router';

import Header from './Header';
import Error from '../404';
import AddSong from './AddSong';
import Playlist from './Playlist';

import default_image from '../default_image.png'

import './Character.css'
import { apiJson } from '../api/apiUtil';
import { TokenContext } from '../AuthRoute';

export const PlaylistContext = createContext([]);
export const MyPlaylistContext = createContext(new Set());

function Character() {
    const { character } = useParams();
    const [data, setData] = useState([]);
    const [code, setCode] = useState('');

    const [playlist, setPlaylist] = useState([]);
    const [myPlaylist, setMyPlaylist] = useState(new Set());

    const [token] = useContext(TokenContext);

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

        async function getMyPlaylist() {
            const myPlaylistData = await apiJson('/api/playlist/mine/' + character + '?access_token=' + token);
            if (myPlaylistData.status === 200) {
                setMyPlaylist(new Set(myPlaylistData.response.playlist));
            }
        }

        getMyPlaylist();

        return () => {
            setCode('');
            setPlaylist([]);
            setMyPlaylist(new Set());
        }

    }, [character, token]);

    return <>
        {
            code === 404 ? <Error /> : <>
                <PlaylistContext.Provider value={[playlist, setPlaylist]}>
                    <MyPlaylistContext.Provider value={[myPlaylist, setMyPlaylist]}>
                        <Header />
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
                    </MyPlaylistContext.Provider>
                </PlaylistContext.Provider>
            </>
        }
    </>
}

export default Character