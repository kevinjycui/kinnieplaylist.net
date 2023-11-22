import React from 'react';
import { useNavigate } from "react-router-dom";

import defaultImage from "../defaultImage.png"

import './CharacterButton.css';

function CharacterButton({ data }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate('/character/' + data.character_id);
    }

    return (
        <div className='CharacterButton-container' id={'CharacterButton-character-' + data.character_id.toString()}
            title={data.name + " from " + data.media}
        >
            <button
                className='CharacterButton-button'
                onClick={handleClick}
            >
                <img className='CharacterButton-image' src={data.img_file} alt={data.name}
                    onError={(image) => {
                        image.target.onerror = null;
                        image.target.src = defaultImage;
                    }}
                />
                <div className='CharacterButton-name'>{data.name}</div>
                <div className='CharacterButton-media'>{data.media}</div>
            </button>
        </div>
    );
}

export default CharacterButton