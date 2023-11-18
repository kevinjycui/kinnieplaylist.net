import React, { Component } from 'react';

class Character extends Component {

    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div id={this.props.data.character_id.toString()}>
                <img src={this.props.data.img_file} />
                <div>{this.props.data.name}</div>
                <div>{this.props.data.media}</div>
            </div>
            );
    }
}

export default Character