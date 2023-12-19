import React from 'react';
import { useNavigate } from "react-router-dom";

import default_image from "../default_image.png"

import './CharacterIcon.css';

function CharacterIcon({ data }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate('/character/' + data.character_id);
    }

    return (
        <div className='CharacterIcon-container' id={'CharacterIcon-character-' + data.character_id.toString()}
            title={data.name + " from " + data.media}
        >
            <button
                className='CharacterIcon-button'
                onClick={handleClick}
            >
                <div className="CharacterIcon-image-container">
                    <img className='CharacterIcon-image' src={data.img_file} alt={data.name}
                        onError={(image) => {
                            image.target.onerror = null;
                            image.target.src = default_image;
                        }}
                    />
                </div>
            </button>
        </div>
    );
}

export default CharacterIcon