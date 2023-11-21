import React from 'react';
import { useNavigate } from "react-router-dom";

import './CharacterButton.css';

function CharacterButton({ data }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate('/character/' + data.character_id);
    }

    return (
        <div className='CharacterButton-container' id={'CharacterButton-character-' + data.character_id.toString()}>
            <button
                className='CharacterButton-button'
                onClick={handleClick}
            >
                <img className='CharacterButton-image' src={'media/' + data.img_file} alt={data.name}
                    onError={(image) => {
                        image.target.onerror = null;
                        image.target.src = '/default.png';
                    }}
                />
                <div className='CharacterButton-name'>{data.name}</div>
                <div className='CharacterButton-media'>{data.media}</div>
            </button>
        </div>
    );
}

export default CharacterButton