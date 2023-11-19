import React from 'react';
import { useNavigate } from "react-router-dom";

import './CharacterButton.css';

function CharacterButton(props) {
    const navigate = useNavigate();

    function handleClick()
    {
        navigate('/character/' + props.data.path);
    }

    return (
        <div className='CharacterButton-container' id={props.data.character_id.toString()}>
            <button
                onClick={handleClick}
            >
                <img className='CharacterButton-image' src={'media/' + props.data.img_file}
                    onError={(image) => {
                        image.target.onerror = null;
                        image.target.src='default.png';
                    }}
                />
                <div className='CharacterButton-name'>{props.data.name}</div>
                <div className='CharacterButton-media'>{props.data.media}</div>
            </button>
        </div>
        );
}

export default CharacterButton