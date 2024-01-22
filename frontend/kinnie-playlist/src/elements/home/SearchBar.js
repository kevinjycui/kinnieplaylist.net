import React, { useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { filterCharacters } from './filterUtil';
import './SearchBar.css';

const SearchBar = ({ characters, setFilteredCharacters, media, searchTerm, setSearchTerm, resetLimit }) => {

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (media !== '' || searchTerm !== '') {
            setFilteredCharacters(filterCharacters(characters, searchTerm, media));
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