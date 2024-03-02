import React from 'react';
import { useSearchParams } from "react-router-dom";
import './SearchBar.css';

const SearchBar = ({ tempSearchTerm, setTempSearchTerm, searchTerm, setSearchTerm }) => {

    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <div className="SearchBar">
            <input
                className="SearchInput"
                type="text"
                placeholder="Try a name or fandom"
                value={tempSearchTerm}
                onChange={(e) => {
                    setTempSearchTerm(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    if (tempSearchTerm === searchTerm)
                    {
                        return;
                    }

                    if (tempSearchTerm === '') {
                        searchParams.delete("q");
                    }
                    else {
                        searchParams.set("q", tempSearchTerm);
                    }
                    searchParams.sort();
                    setSearchParams(searchParams);
                    setSearchTerm(tempSearchTerm);
                }}
            >Search</button>
        </div>
    );
};

export default SearchBar;