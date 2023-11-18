import React, { Component } from 'react';

import './Character.css';

class Character extends Component {

    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div id={this.props.data.character_id.toString()}>
                <img className='Character-image' src={this.props.data.img_file}
                    onError={(image) => {
                        image.target.onerror = null;
                        image.target.src='default.png';
                    }}
                />
                <div className='Character-name'>{this.props.data.name}</div>
                <div className='Character-media'>{this.props.data.media}</div>
            </div>
            );
    }
}

export default Character