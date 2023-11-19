import React, { useState, useEffect } from 'react';

function Playlist(props) {

  const [songs, setSongs] = useState([]);

  useEffect(() => {

    async function getSongs() {
      const response = await fetch('/api/playlist/global/' + props.character_id);
      const json = await response.json();
      setSongs([...json.playlist]);
    }

    getSongs();

  }, []);

  return (
    <>
    </>
  );
}

export default Playlist;