import React, { useState, useEffect } from 'react';

import CharacterButton from './CharacterButton'
import SearchBar from './SearchBar'
import './Home.css';

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

  const [filteredCharacters, setFilteredCharacters] = useState([]);
 // alert(filteredCharacters)
  var display = <>test</>;
    if (filteredCharacters.length==0){
    display = <> {
      characters.sort((a, b) => {
        var nameA = JSON.parse(a).name.toUpperCase();
        var nameB = JSON.parse(b).name.toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
      }).map(character => (
        <div className='Home-characterModule'>
          <CharacterButton 
              key={JSON.parse(character).character_id} 
              data={JSON.parse(character)}
              />
        </div>
      ))
    }</>
  } 
  return (
    <>
        <>
      <SearchBar characters={characters} setFilteredCharacters={setFilteredCharacters} />
      <div className='Home-container'>
      {filteredCharacters.sort((a, b) => {
        var nameA = JSON.parse(a).name.toUpperCase();
        var nameB = JSON.parse(b).name.toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
      }).map(character => (
        <div className='Home-characterModule' key={JSON.parse(character).character_id}>
          <CharacterButton 
            data={JSON.parse(character)}
          />
        </div>
      ))}
      </div>
    </>
     <div className="buffer"></div>
    </>
  );
}

export default Home;