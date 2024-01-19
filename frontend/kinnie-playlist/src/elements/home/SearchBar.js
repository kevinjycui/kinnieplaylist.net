import React, { useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import './SearchBar.css';

const SearchBar = ({ characters, setFilteredCharacters, media, searchTerm, setSearchTerm, resetLimit }) => {

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (media !== '' || searchTerm !== '') {
            const filtered = characters.filter(character => {
                return (media === '' || character.media === media || character.media2 === media) && 
                    searchTerm.toUpperCase().split(" ").every((keyword) => (character.name + character.media).toUpperCase().includes(keyword));
            }).sort(
                (character1, character2) => character1.name.replace("\"", "") > character2.name.replace("\"", "") ? 1:-1
            )
            setFilteredCharacters(filtered);
        }
        else {
            setFilteredCharacters(characters);
        }
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
                if (e.target.value === '') {
                    searchParams.delete("q");
                }
                else {
                    searchParams.set("q", e.target.value);
                }
                searchParams.sort();
                setSearchParams(searchParams);
               }}
            />
        </div>
    );
};

export default SearchBar;