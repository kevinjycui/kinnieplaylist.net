import React, { useState, useEffect, useContext, createContext, Suspense } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Error from '../../404';
import AddSong from './AddSong';
import Playlist from './Playlist';

import default_image from '../../default_image.png'

import './Character.css'
import { apiJson } from '../../api/apiUtil';
import { TokenContext } from '../../AuthRoute';
import CharacterIcon from '../CharacterIcon';

export const PlaylistContext = createContext([]);
export const MyPlaylistContext = createContext(new Set());

function Character() {
    const { character } = useParams();
    const navigate = useNavigate();

    function navigateToMedia(media) {
        navigate('/?fandom=' + media.replaceAll(' ', '+'));
    }

    const [data, setData] = useState([]);
    const [code, setCode] = useState('');

    const [playlist, setPlaylist] = useState([]);
    const [myPlaylist, setMyPlaylist] = useState(new Set());

    const [similar, setSimilar] = useState([]);

    const [token] = useContext(TokenContext);

    useEffect(() => {
        document.title = "Loading...";

        async function getData() {
            const characterData = await apiJson('/api/character/' + character);
            if (characterData.status === 200) {
                document.title = characterData.response.name + " | Kinnie Playlist";
                setData(characterData.response);
            }
            setCode(characterData.status);
        }
        
        getData();

        async function getPlaylist() {
            const playlistData = await apiJson('/api/playlist/global/' + character);
            if (playlistData.status === 200) {
                setPlaylist(playlistData.response.playlist);
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

        async function getSimilar() {
            const similarData = await apiJson('/api/characters/similar/' + character);
            if (similarData.status === 200) {
                setSimilar(similarData.response.characters.map((data) => JSON.parse(data)))
            }
        }

        getSimilar();

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
                                <div className='Character-media'>
                                    <button className='Character-media-button' onClick={() => navigateToMedia(data.media)}>{data.media}</button>
                                    {data.media2 != null ? 
                                        <button className='Character-media-button' onClick={() => navigateToMedia(data.media2)}>{data.media2}</button>
                                        : <></>}
                                </div>
                            </div>
                            <div className='Character-stats'>
                                <AddSong />
                                {
                                    similar.length > 0 ? 
                                    <div className='Character-stats-similar-container'>
                                        Similar characters:
                                        <div className='Character-stats-similar'>
                                            <div className='Character-stats-similar'>
                                                {similar.map((character) => 
                                                <CharacterIcon key={character.character_id} data={character} />)}
                                            </div>
                                        </div>
                                    </div>
                                    : <></>
                                }
                            </div>
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