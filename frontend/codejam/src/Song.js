import React from 'react';

function Song(props) {
    return (
        <div className="Song" id={props.data.song_id}>
            <img className="Song-image" src={props.data.img_file}
                onError={(image) => {
                    image.target.onerror = null;
                    image.target.src='default.png';
                }}
            />
            <div className="Song-title">{props.data.title}</div>
            <div className="Song-artists">{props.data.artists}</div>
        </div>
        );
}

export default Song