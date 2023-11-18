import React, { useState, useEffect } from 'react';

import Character from './Character'
import WebPlayback from './WebPlayback';

function Home() {

  const [characters, setCharacters] = useState([]);

  useEffect(() => {

    async function getCharacters() {
      const response = await fetch('/api/characters');
      const json = await response.json();
      setCharacters([...json.characters]);
    }

    getCharacters();

  }, []);

  return (
    <>
      {
        characters.map(character => (
          <Character 
              key={JSON.parse(character).character_id} 
              data={JSON.parse(character)}
              />
        ))
      }
      <WebPlayback />
    </>
  );
}

export default Home;