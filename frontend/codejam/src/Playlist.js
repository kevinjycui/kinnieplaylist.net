import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import Song from './Song';

function Playlist() {
    const { character } = useParams();
    const [playlist, setPlaylist] = useState([]);
  
    useEffect(() => {
      async function getPlaylist()
      {
          const response = await fetch('/api/playlist/global/' + character);
          const json = await response.json();        
          setPlaylist(json.playlist);
      }

      getPlaylist();
  
    }, []);

    return <>
        {
            <div>
            {
            playlist.map(
                (data) => <Song data={JSON.parse(data.song)}/>
            )
            }
            </div>
        }
    </>
}

export default Playlist