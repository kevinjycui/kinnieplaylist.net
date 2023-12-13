import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ characters, setFilteredCharacters }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filtered = characters.filter(character => {
      const characterInfo = (character.name + character.media).toUpperCase();
      return searchTerm.toUpperCase().split(" ").every((keyword) => characterInfo.includes(keyword));
    });
    setFilteredCharacters(filtered);
  }, [searchTerm, characters, setFilteredCharacters]);

  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="text"
        placeholder="Search by name or media (e.g. Shinji Ikari Neon Genesis Evangelion)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;