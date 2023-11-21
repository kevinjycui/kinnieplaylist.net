import React from 'react';

import "./Song.css"

function Song({ index, data }) {
    return (
        <div className="Song" id={data.song_id}>
            <div className="Song-index">
                {index + 1}
            </div>
            <img className="Song-image" src={data.img_file} alt={data.title}
                onError={(image) => {
                    image.target.onerror = null;
                    image.target.src = '/default.png';
                }}
            />
            <div className="Song-side">
                <div className="Song-title">{data.title}</div>
                <div className="Song-artists">{data.artists}</div>
            </div>
        </div>
    );
}

export default Song