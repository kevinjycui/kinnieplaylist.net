import React, { useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ characters, setFilteredCharacters, media, searchTerm, setSearchTerm, resetLimit }) => {

    useEffect(() => {
        const filtered = characters.filter(character => {
            return (media === '' || character.media === media || character.media2 === media) && 
                searchTerm.toUpperCase().split(" ").every((keyword) => (character.name + character.media).toUpperCase().includes(keyword));
        })
        setFilteredCharacters(filtered);
    }, [searchTerm, media, characters, setFilteredCharacters]);

    return (
        <div className="SearchBar">
            <input
              className="SearchInput"
              type="text"
              placeholder="Search by name or fandom"
              value={searchTerm}
              onChange={(e) => {
                resetLimit();
                setSearchTerm(e.target.value);
               }}
            />
        </div>
    );
};

export default SearchBar;