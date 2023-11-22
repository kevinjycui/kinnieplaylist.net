import React from 'react';

import "./Song.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'

function Song({ index, data, number }) {
    return (
        <div className="Song" id={data.song_id}>
            <div className="Song-info">
                <FontAwesomeIcon className="Song-vote" icon={faAngleUp} />
                <div className="Song-index">{index + 1}</div>
                <div className="Song-number">{number + (number === 1 ? ' vote' : ' votes')}</div>
            </div>
            {/* <img className="Song-image" src={data.img_file} alt={data.title}
                onError={(image) => {
                    image.target.onerror = null;
                    image.target.src = '/default.png';
                }}
            />
            <div className="Song-side">
                <div className="Song-title">{data.title}</div>
                <div className="Song-artists">{data.artists}</div>
            </div> */}

            <iframe title="Play on Spotify" src={"https://open.spotify.com/embed/track/" + data.song_id + "?utm_source=generator&theme=0"} width="100%" height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    );
}

export default Song