import React, { useState, useEffect } from 'react';
import './SearchBar.css';
const SearchBar = ({ characters, setFilteredCharacters }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filtered = characters.filter(character => {
      var characterName = JSON.parse(character).name.toUpperCase();
      var mediaName = JSON.parse(character).media.toUpperCase();
      return characterName.includes(searchTerm.toUpperCase()) || mediaName.includes(searchTerm.toUpperCase());
    });
    setFilteredCharacters(filtered);
  }, [searchTerm, characters, setFilteredCharacters]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name or media"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* <button onClick={handleSearch}>Search</button> */}
    </div>
  );
};

export default SearchBar;